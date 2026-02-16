import materiaService from '../services/materia.service.js';
import logger from '../utils/logger.js';

/**
 * Controlador para las operaciones de materias
 */
class MateriaController {
    /**
     * Obtiene el estado de la API externa
     * @route GET /api/materia/status
     */
    async getStatus(req, res, next) {
        try {
            const status = await materiaService.getStatus();
            res.status(200).json({
                success: true,
                data: status
            });
        } catch (error) {
            logger.error(`Error en getStatus: ${error.message}`);
            next(error);
        }
    }

    /**
     * Obtiene todas las materias con opciones de filtrado, ordenación y paginación
     * @route GET /api/materia
     * @query {string} name - Filtrar por nombre de materia
     * @query {string} type - Filtrar por tipo de materia
     * @query {string} sortBy - Campo por el que ordenar (name, type, etc.)
     * @query {string} order - Orden: asc o desc
     * @query {number} page - Número de página (default: 1)
     * @query {number} limit - Resultados por página (default: 10)
     */
    async getAllMaterias(req, res, next) {
        try {
            const options = {
                name: req.query.name,
                type: req.query.type,
                sortBy: req.query.sortBy,
                order: req.query.order,
                page: req.query.page,
                limit: req.query.limit
            };

            const result = await materiaService.getAllMaterias(options);
            
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            logger.error(`Error en getAllMaterias: ${error.message}`);
            next(error);
        }
    }

    /**
     * Obtiene una materia específica por nombre
     * @route GET /api/materia/:id
     * @param {string} id - Nombre de la materia
     */
    async getMateriaById(req, res, next) {
        try {
            const { id } = req.params;
            const materia = await materiaService.getMateriaById(id);
            
            res.status(200).json({
                success: true,
                data: materia
            });
        } catch (error) {
            logger.error(`Error en getMateriaById: ${error.message}`);
            
            if (error.message === 'Materia no encontrada') {
                return res.status(404).json({
                    success: false,
                    error: 'Materia no encontrada'
                });
            }
            
            next(error);
        }
    }
}

export default new MateriaController();
