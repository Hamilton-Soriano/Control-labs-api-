import { Request, Response, NextFunction } from 'express';
import { ICreateLoanDTO } from '../dtos/loan.dto';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isCreateLoanDTO = (value: unknown): value is ICreateLoanDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const loan = value as Record<string, unknown>;
  return (
    typeof loan.roomId === 'string' &&
    UUID_PATTERN.test(loan.roomId) &&
    typeof loan.instructorId === 'string' &&
    UUID_PATTERN.test(loan.instructorId) &&
    typeof loan.guardaId === 'string' &&
    UUID_PATTERN.test(loan.guardaId) &&
    typeof loan.numeroPc === 'number'
  );
};

export const validateLoanPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isCreateLoanDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos del préstamo inválidos.'
    });
    return;
  }
  next();
};