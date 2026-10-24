import { Router } from 'express';
import { EnvironmentController } from '../controllers/environment.controller';

const router = Router();

// Montado en /api/v1/environments
router.get('/', EnvironmentController.getEnvironments);          // GET   /api/v1/environments
router.post('/', EnvironmentController.createEnvironment);       // POST  /api/v1/environments
router.patch('/:id', EnvironmentController.updateEnvironment);   // PATCH /api/v1/environments/:id (capacidad, estado operativo...)

export default router;
