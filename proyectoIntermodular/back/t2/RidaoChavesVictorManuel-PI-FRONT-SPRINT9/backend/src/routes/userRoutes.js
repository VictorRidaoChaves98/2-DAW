import express from 'express';
import { obtenerPerfil, actualizarPerfil } from '../controllers/userController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Obtener perfil de usuario
router.get('/:id', autenticar, obtenerPerfil);

// Actualizar perfil de usuario
router.put('/:id', autenticar, actualizarPerfil);

export default router;
