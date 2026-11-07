const assert = require('node:assert/strict');
const { test } = require('node:test');
const { DomainError } = require('../dist/src/errors/domain.error.js');
const {
  PostgresLoanRepository,
} = require('../dist/src/repositories/postgres-loan.repository.js');

const row = (overrides = {}) => ({
  id: '17',
  room_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
  instructor_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
  guarda_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
  numero_pc: 2,
  estado: 'PENDIENTE_APROBACION',
  created_at: new Date('2026-11-07T12:00:00.000Z'),
  accepted_at: null,
  ...overrides,
});

class FakePool {
  calls = [];

  constructor(responses) {
    this.responses = responses;
  }

  async query(sql, values) {
    this.calls.push({ sql, values });
    const response = this.responses.shift();
    if (response instanceof Error) {
      throw response;
    }
    return { rows: response };
  }
}

test('create traduce el DTO a columnas SQL y mapea el registro', async () => {
  const pool = new FakePool([[row()]]);
  const repository = new PostgresLoanRepository(pool);
  const loan = await repository.create({
    roomId: row().room_id,
    instructorId: row().instructor_id,
    guardaId: row().guarda_id,
    numeroPc: 2,
  });

  assert.match(pool.calls[0].sql, /INSERT INTO loans/);
  assert.deepEqual(pool.calls[0].values, [
    row().room_id,
    row().instructor_id,
    row().guarda_id,
    2,
  ]);
  assert.equal(loan.id, '17');
  assert.equal(loan.roomId, row().room_id);
  assert.equal(loan.estado, 'PENDIENTE_APROBACION');
  assert.equal(loan.createdAt, '2026-11-07T12:00:00.000Z');
});

test('findAll filtra con parámetro seguro por ambiente', async () => {
  const pool = new FakePool([[row()]]);
  const repository = new PostgresLoanRepository(pool);
  const loans = await repository.findAll({ roomId: row().room_id });

  assert.match(pool.calls[0].sql, /WHERE room_id = \$1/);
  assert.deepEqual(pool.calls[0].values, [row().room_id]);
  assert.equal(loans.length, 1);
});

test('findById devuelve null cuando PostgreSQL no encuentra el préstamo', async () => {
  const pool = new FakePool([[]]);
  const repository = new PostgresLoanRepository(pool);

  assert.equal(await repository.findById('999'), null);
  assert.deepEqual(pool.calls[0].values, ['999']);
});

test('updateStatus ejecuta una transición condicional y mapea accepted_at', async () => {
  const acceptedAt = new Date('2026-11-07T12:30:00.000Z');
  const pool = new FakePool([
    [row({ estado: 'APROBADO_Y_FIRMADO', accepted_at: acceptedAt })],
  ]);
  const repository = new PostgresLoanRepository(pool);
  const loan = await repository.updateStatus(
    '17',
    'PENDIENTE_APROBACION',
    'APROBADO_Y_FIRMADO',
  );

  assert.match(pool.calls[0].sql, /WHERE id = \$1 AND estado = \$2/);
  assert.deepEqual(pool.calls[0].values, [
    '17',
    'PENDIENTE_APROBACION',
    'APROBADO_Y_FIRMADO',
  ]);
  assert.equal(loan.estado, 'APROBADO_Y_FIRMADO');
  assert.equal(loan.acceptedAt, '2026-11-07T12:30:00.000Z');
});

test('create convierte violaciones FK en error de validación', async () => {
  const foreignKeyError = new Error('foreign key violation');
  foreignKeyError.code = '23503';
  const pool = new FakePool([foreignKeyError]);
  const repository = new PostgresLoanRepository(pool);

  await assert.rejects(
    repository.create({
      roomId: row().room_id,
      instructorId: row().instructor_id,
      guardaId: row().guarda_id,
      numeroPc: 2,
    }),
    (error) =>
      error instanceof DomainError &&
      error.code === 'VALIDATION_ERROR',
  );
});
