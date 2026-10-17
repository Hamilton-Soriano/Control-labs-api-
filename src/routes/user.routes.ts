import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

// Montado en /api/v1/users
router.get('/', UserController.getUsers);              // GET    /api/v1/users
router.post('/', UserController.createUser);           // POST   /api/v1/users
router.get('/:id', UserController.getUserById);        // GET    /api/v1/users/:id
router.patch('/:id', UserController.updateUser);       // PATCH  /api/v1/users/:id  (rol, estado o contraseña)
router.delete('/:id', UserController.deleteUser);      // DELETE /api/v1/users/:id  (eliminación lógica)

export default router;
