import express from 'express';
import {
    crearReceta,
    obtenerRecetas,
    obtenerReceta,
    obtenerRecetasUsuario,
    actualizarReceta,
    eliminarReceta,
} from '../controllers/recipeController.js';
import { autenticar, soloNutricionista } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', autenticar, crearReceta);
router.get('/', obtenerRecetas);
router.get('/:id', obtenerReceta);
router.get('/usuario/:usuarioId', obtenerRecetasUsuario);
router.put('/:id', autenticar, actualizarReceta);
router.delete('/:id', autenticar, eliminarReceta);

export default router;
