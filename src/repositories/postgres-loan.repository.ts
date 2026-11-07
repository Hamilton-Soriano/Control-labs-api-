import { Pool } from 'pg';
import { ICreateLoanDTO } from '../dtos/loan.dto';
import { DomainError } from '../errors/domain.error';
import {
  Loan,
  LoanFilters,
  LoanRepository,
  LoanStatus
} from './loan.repository';

interface LoanRow {
  id: string;
  room_id: string;
  instructor_id: string;
  guarda_id: string;
  numero_pc: number;
  estado: LoanStatus;
  created_at: Date;
  accepted_at: Date | null;
}

const mapLoanRow = (row: LoanRow): Loan => ({
  id: row.id,
  roomId: row.room_id,
  instructorId: row.instructor_id,
  guardaId: row.guarda_id,
  numeroPc: row.numero_pc,
  estado: row.estado,
  createdAt: row.created_at.toISOString(),
  acceptedAt: row.accepted_at?.toISOString() ?? null
});

const isPostgresErrorCode = (
  error: unknown,
  code: string
): error is { code: string } =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === code;

export class PostgresLoanRepository implements LoanRepository {
  constructor(private readonly pool: Pool) {}

  public async create(input: ICreateLoanDTO): Promise<Loan> {
    try {
      const result = await this.pool.query<LoanRow>(
        `INSERT INTO loans (room_id, instructor_id, guarda_id, numero_pc)
         VALUES ($1, $2, $3, $4)
         RETURNING id::text, room_id, instructor_id, guarda_id, numero_pc,
                   estado, created_at, accepted_at`,
        [
          input.roomId,
          input.instructorId,
          input.guardaId,
          input.numeroPc
        ]
      );

      return mapLoanRow(result.rows[0]);
    } catch (error) {
      if (isPostgresErrorCode(error, '23503')) {
        throw new DomainError(
          'VALIDATION_ERROR',
          'El ambiente, instructor o guarda indicado no existe.'
        );
      }
      throw error;
    }
  }

  public async findAll(filters: LoanFilters = {}): Promise<Loan[]> {
    const values: string[] = [];
    let whereClause = '';

    if (filters.roomId !== undefined) {
      values.push(filters.roomId);
      whereClause = 'WHERE room_id = $1';
    }

    const result = await this.pool.query<LoanRow>(
      `SELECT id::text, room_id, instructor_id, guarda_id, numero_pc,
              estado, created_at, accepted_at
       FROM loans
       ${whereClause}
       ORDER BY created_at DESC, id DESC`,
      values
    );

    return result.rows.map(mapLoanRow);
  }

  public async findById(id: string): Promise<Loan | null> {
    const result = await this.pool.query<LoanRow>(
      `SELECT id::text, room_id, instructor_id, guarda_id, numero_pc,
              estado, created_at, accepted_at
       FROM loans
       WHERE id = $1`,
      [id]
    );

    return result.rows[0] ? mapLoanRow(result.rows[0]) : null;
  }

  public async updateStatus(
    id: string,
    expectedStatus: LoanStatus,
    status: LoanStatus
  ): Promise<Loan | null> {
    const result = await this.pool.query<LoanRow>(
      `UPDATE loans
       SET estado = $3,
           accepted_at = CASE WHEN $3 = 'APROBADO_Y_FIRMADO' THEN now() ELSE NULL END
       WHERE id = $1 AND estado = $2
       RETURNING id::text, room_id, instructor_id, guarda_id, numero_pc,
                 estado, created_at, accepted_at`,
      [id, expectedStatus, status]
    );

    return result.rows[0] ? mapLoanRow(result.rows[0]) : null;
  }
}
