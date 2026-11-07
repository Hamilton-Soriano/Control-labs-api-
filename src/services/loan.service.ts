import { ICreateLoanDTO } from '../dtos/loan.dto';
import { DomainError } from '../errors/domain.error';
import {
  Loan,
  LoanFilters,
  LoanRepository
} from '../repositories/loan.repository';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_POSTGRES_INTEGER = 2_147_483_647;

export class LoanService {
  constructor(private readonly loanRepository: LoanRepository) {}

  public async createLoan(input: ICreateLoanDTO): Promise<Loan> {
    if (
      !Number.isSafeInteger(input.numeroPc) ||
      input.numeroPc <= 0 ||
      input.numeroPc > MAX_POSTGRES_INTEGER
    ) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El número de PCs debe ser un entero positivo.'
      );
    }

    return this.loanRepository.create({
      roomId: input.roomId.toLowerCase(),
      instructorId: input.instructorId.toLowerCase(),
      guardaId: input.guardaId.toLowerCase(),
      numeroPc: input.numeroPc
    });
  }

  public async getLoans(filters: LoanFilters = {}): Promise<Loan[]> {
    if (filters.roomId !== undefined && !UUID_PATTERN.test(filters.roomId)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro roomId debe ser un UUID válido.'
      );
    }

    return this.loanRepository.findAll({
      roomId: filters.roomId?.toLowerCase()
    });
  }

  public async getLoanDetail(id: string): Promise<Loan> {
    this.validateId(id);
    const loan = await this.loanRepository.findById(id);
    if (!loan) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un préstamo con identificador ${id}.`
      );
    }
    return loan;
  }

  public async acceptLoan(id: string): Promise<Loan> {
    this.validateId(id);

    const updatedLoan = await this.loanRepository.updateStatus(
      id,
      'PENDIENTE_APROBACION',
      'APROBADO_Y_FIRMADO'
    );
    if (updatedLoan) {
      return updatedLoan;
    }

    const currentLoan = await this.loanRepository.findById(id);
    if (!currentLoan) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un préstamo con identificador ${id}.`
      );
    }

    throw new DomainError(
      'CONFLICT',
      'El préstamo ya fue aceptado y no puede aceptarse nuevamente.'
    );
  }

  private validateId(id: string): void {
    if (!/^[1-9]\d*$/.test(id)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El identificador del préstamo debe ser un entero positivo.'
      );
    }
  }
}
