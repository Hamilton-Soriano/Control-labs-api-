const assert = require('node:assert/strict');
const { test } = require('node:test');
const { DomainError } = require('../dist/src/errors/domain.error.js');
const { LoanService } = require('../dist/src/services/loan.service.js');

const roomId = 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44';
const instructorId = 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33';
const guardaId = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22';

class FakeLoanRepository {
  loans = new Map();
  nextId = 1;

  async create(input) {
    const loan = {
      ...input,
      id: String(this.nextId++),
      estado: 'PENDIENTE_APROBACION',
      createdAt: new Date().toISOString(),
      acceptedAt: null,
    };
    this.loans.set(loan.id, loan);
    return { ...loan };
  }

  async findAll(filters = {}) {
    return [...this.loans.values()]
      .filter((loan) => !filters.roomId || loan.roomId === filters.roomId)
      .map((loan) => ({ ...loan }));
  }

  async findById(id) {
    const loan = this.loans.get(id);
    return loan ? { ...loan } : null;
  }

  async updateStatus(id, expectedStatus, status) {
    const loan = this.loans.get(id);
    if (!loan || loan.estado !== expectedStatus) {
      return null;
    }

    const updated = {
      ...loan,
      estado: status,
      acceptedAt: new Date().toISOString(),
    };
    this.loans.set(id, updated);
    return { ...updated };
  }
}

const makeService = () => {
  const repository = new FakeLoanRepository();
  return { repository, service: new LoanService(repository) };
};

const validInput = {
  roomId,
  instructorId,
  guardaId,
  numeroPc: 1,
};

test('createLoan normaliza UUID y crea el estado inicial pendiente', async () => {
  const { service } = makeService();
  const loan = await service.createLoan({
    ...validInput,
    roomId: roomId.toUpperCase(),
  });

  assert.equal(loan.roomId, roomId);
  assert.equal(loan.estado, 'PENDIENTE_APROBACION');
  assert.equal(loan.acceptedAt, null);
});

test('createLoan rechaza cantidades no enteras, no positivas o fuera del tipo SQL', async () => {
  const { service } = makeService();

  for (const numeroPc of [0, -1, 1.5, 2_147_483_648]) {
    await assert.rejects(
      service.createLoan({ ...validInput, numeroPc }),
      (error) =>
        error instanceof DomainError &&
        error.code === 'VALIDATION_ERROR',
    );
  }
});

test('getLoans valida el filtro y normaliza roomId', async () => {
  const { service, repository } = makeService();
  await service.createLoan(validInput);

  assert.equal((await service.getLoans({ roomId })).length, 1);
  assert.equal(
    (await service.getLoans({ roomId: roomId.toUpperCase() })).length,
    1,
  );
  await assert.rejects(
    service.getLoans({ roomId: 'not-a-uuid' }),
    (error) =>
      error instanceof DomainError &&
      error.code === 'VALIDATION_ERROR',
  );
  assert.equal(repository.loans.size, 1);
});

test('getLoanDetail distingue identificadores inválidos e inexistentes', async () => {
  const { service } = makeService();

  await assert.rejects(
    service.getLoanDetail('0'),
    (error) =>
      error instanceof DomainError &&
      error.code === 'VALIDATION_ERROR',
  );
  await assert.rejects(
    service.getLoanDetail('44'),
    (error) =>
      error instanceof DomainError &&
      error.code === 'NOT_FOUND',
  );
});

test('acceptLoan solo permite la transición pendiente a aprobado una vez', async () => {
  const { service } = makeService();
  const created = await service.createLoan(validInput);
  const accepted = await service.acceptLoan(created.id);

  assert.equal(accepted.estado, 'APROBADO_Y_FIRMADO');
  assert.ok(accepted.acceptedAt);
  await assert.rejects(
    service.acceptLoan(created.id),
    (error) =>
      error instanceof DomainError &&
      error.code === 'CONFLICT',
  );
});
