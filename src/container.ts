import { database } from './config/database';
import { PostgresLoanRepository } from './repositories/postgres-loan.repository';
import { LoanService } from './services/loan.service';

const loanRepository = new PostgresLoanRepository(database);

export const loanService = new LoanService(loanRepository);
