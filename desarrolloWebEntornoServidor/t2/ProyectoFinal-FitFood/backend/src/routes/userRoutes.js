// Rutas de usuario: consulta y actualización de perfil
import express from 'express';
import { obtenerPerfil, actualizarPerfil } from '../controllers/userController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener perfil de usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Perfil de usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', autenticar, obtenerPerfil);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar perfil de usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', autenticar, actualizarPerfil);

export default router;
