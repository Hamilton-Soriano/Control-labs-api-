import { Request, Response } from 'express';
import { ICreateLoanDTO } from '../dtos/loan.dto';
import { DomainError } from '../errors/domain.error';
import { loanService } from '../container';

export class LoanController {
  public static createLoan = async (
    req: Request<Record<string, string>, unknown, ICreateLoanDTO>,
    res: Response
  ): Promise<void> => {
    const loan = await loanService.createLoan(req.body);
    res.status(201).json({ success: true, data: loan });
  };

  public static getLoansByFilter = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { roomId } = req.query;
    if (roomId !== undefined && typeof roomId !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro roomId debe ser un texto.'
      );
    }

    const loans = await loanService.getLoans({ roomId });
    res.status(200).json({ success: true, data: loans });
  };

  public static getLoanById = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const loan = await loanService.getLoanDetail(req.params.id);
    res.status(200).json({ success: true, data: loan });
  };

  public static acceptLoanInventory = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const loan = await loanService.acceptLoan(req.params.id);
    res.status(200).json({ success: true, data: loan });
  };
}
