import express from 'express';
import {
    crearIngrediente,
    obtenerIngredientes,
    obtenerIngrediente,
    actualizarIngrediente,
    eliminarIngrediente,
} from '../controllers/ingredientController.js';
import { autenticar, soloAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Pública (listado/búsqueda)
router.get('/', obtenerIngredientes);
router.get('/:id', obtenerIngrediente);

// Admin
router.post('/', autenticar, soloAdmin, crearIngrediente);
router.put('/:id', autenticar, soloAdmin, actualizarIngrediente);
router.delete('/:id', autenticar, soloAdmin, eliminarIngrediente);

export default router;
