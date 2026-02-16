import express from 'express';
import { registrar, login, verificarToken } from '../controllers/userController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/registro', registrar);
router.post('/login', login);
router.get('/verificar', autenticar, verificarToken);

export default router;
