import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';

const router = Router();

// Montado en /api/v1/equipment
router.get('/', EquipmentController.getEquipment);          // GET   /api/v1/equipment  o  /api/v1/equipment?environmentId=...
router.post('/', EquipmentController.createEquipment);       // POST  /api/v1/equipment  (con environmentId en el body)
router.patch('/:id', EquipmentController.updateEquipment);   // PATCH /api/v1/equipment/:id (estado técnico o ubicación)

export default router;
