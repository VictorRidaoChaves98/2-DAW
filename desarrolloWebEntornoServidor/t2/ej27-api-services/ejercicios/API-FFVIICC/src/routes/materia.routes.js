import express from 'express';
import materiaController from '../controllers/materia.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/materia/status:
 *   get:
 *     summary: Obtiene el estado de la API externa
 *     tags: [Materia]
 *     responses:
 *       200:
 *         description: Estado de la API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.get('/status', materiaController.getStatus);

/**
 * @swagger
 * /api/materia:
 *   get:
 *     summary: Obtiene todas las materias con filtros, ordenación y paginación
 *     tags: [Materia]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de materia
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de materia
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Campo por el que ordenar (name, type, etc.)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Orden ascendente o descendente
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Resultados por página
 *     responses:
 *       200:
 *         description: Lista de materias con metadatos de paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *                 filters:
 *                   type: object
 */
router.get('/', materiaController.getAllMaterias);

/**
 * @swagger
 * /api/materia/{id}:
 *   get:
 *     summary: Obtiene una materia específica por nombre
 *     tags: [Materia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la materia
 *     responses:
 *       200:
 *         description: Datos de la materia
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Materia no encontrada
 */
router.get('/:id', materiaController.getMateriaById);

export default router;
