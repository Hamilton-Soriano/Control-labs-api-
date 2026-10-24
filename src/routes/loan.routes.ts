import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';

const router = Router();

// Primero los paths estáticos (/search) y luego los dinámicos (/:id)
router.get('/search', LoanController.getLoansByFilter);
router.post('/', LoanController.createLoan);
router.put('/:id/accept', LoanController.acceptLoanInventory);
router.get('/:id', LoanController.getLoanById);

export default router;
