import * as materiaClient from './materia-client.js';
import logger from '../utils/logger.js';

/**
 * Servicio de alto nivel para gestión de materias
 * Orquesta las operaciones del cliente y aplica lógica de negocio
 */
class MateriaService {
    /**
     * Obtiene el estado de la API
     * @returns {Promise<Object>} Estado de la API
     */
    async getStatus() {
        return materiaClient.getStatus();
    }

    /**
     * Obtiene todas las materias con filtros, ordenación y paginación
     * @param {Object} options - Opciones de consulta
     * @param {string} options.name - Filtrar por nombre de materia
     * @param {string} options.type - Filtrar por tipo de materia
     * @param {string} options.sortBy - Campo por el que ordenar
     * @param {string} options.order - Orden ascendente (asc) o descendente (desc)
     * @param {number} options.page - Página actual
     * @param {number} options.limit - Número de resultados por página
     * @returns {Promise<Object>} Lista de materias con metadatos de paginación
     */
    async getAllMaterias(options = {}) {
        try {
            // 1. Obtener todas las materias de la API
            let materias = await materiaClient.getAllMaterias();

            // 2. Aplicar filtros
            if (options.name) {
                materias = materiaClient.filterByName(materias, options.name);
            }

            if (options.type) {
                materias = materiaClient.filterByType(materias, options.type);
            }

            // 3. Aplicar ordenación
            if (options.sortBy) {
                materias = materiaClient.sortMaterias(materias, options.sortBy, options.order);
            }

            // 4. Aplicar paginación
            const page = parseInt(options.page) || 1;
            const limit = parseInt(options.limit) || 10;
            const result = materiaClient.paginateMaterias(materias, page, limit);

            logger.info(`Materias procesadas: ${result.data.length} de ${result.pagination.total}`);

            // 5. Añadir información de filtros aplicados
            return {
                ...result,
                filters: {
                    name: options.name || null,
                    type: options.type || null,
                    sortBy: options.sortBy || null,
                    order: options.order || null
                }
            };
        } catch (error) {
            logger.error(`Error en getAllMaterias: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene una materia por nombre
     * @param {string} name - Nombre de la materia
     * @returns {Promise<Object>} Datos de la materia
     */
    async getMateriaById(name) {
        return materiaClient.getMateriaById(name);
    }

    /**
     * Busca materias por nombre (método auxiliar)
     * @param {string} searchTerm - Término de búsqueda
     * @returns {Promise<Object>} Materias que coinciden con el término
     */
    async searchByName(searchTerm) {
        return this.getAllMaterias({ name: searchTerm });
    }

    /**
     * Busca materias por tipo (método auxiliar)
     * @param {string} type - Tipo de materia
     * @returns {Promise<Object>} Materias del tipo especificado
     */
    async searchByType(type) {
        return this.getAllMaterias({ type });
    }
}

export default new MateriaService();
