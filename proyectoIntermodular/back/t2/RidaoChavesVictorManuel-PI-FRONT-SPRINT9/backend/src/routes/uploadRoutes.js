import express from 'express';
import { subirImagenReceta, subirImagenPerfil } from '../controllers/uploadController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/receta', autenticar, subirImagenReceta);
router.post('/perfil', autenticar, subirImagenPerfil);

export default router;
