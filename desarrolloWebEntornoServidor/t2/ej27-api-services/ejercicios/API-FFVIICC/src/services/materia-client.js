import * as materiaCore from './materia-core.js';
import logger from '../utils/logger.js';

/**
 * Obtiene el estado de la API externa
 * @returns {Promise<Object>} Estado de la API
 */
export async function getStatus() {
    try {
        const data = await materiaCore.get('/status');
        logger.info('Estado de la API consultado correctamente');
        return data;
    } catch (error) {
        logger.error(`Error al consultar el estado de la API: ${error.message}`);
        throw new Error('Error al consultar el estado de la API externa');
    }
}

/**
 * Obtiene todas las materias de la API externa
 * @returns {Promise<Array>} Lista completa de materias
 */
export async function getAllMaterias() {
    try {
        const data = await materiaCore.get('/materia');
        logger.info(`Materias obtenidas de la API: ${data.length}`);
        return data;
    } catch (error) {
        logger.error(`Error al obtener materias: ${error.message}`);
        throw new Error('Error al consultar la API externa de materias');
    }
}

/**
 * Obtiene una materia específica por nombre
 * Como la API externa no soporta consultas individuales, obtenemos todas y filtramos
 * @param {string} name - Nombre de la materia
 * @returns {Promise<Object>} Datos de la materia
 */
export async function getMateriaById(name) {
    try {
        // Obtener todas las materias
        const materias = await getAllMaterias();
        
        // Buscar la materia por nombre (case-insensitive)
        const materia = materias.find(m => 
            m.name && m.name.toLowerCase() === name.toLowerCase()
        );
        
        if (!materia) {
            logger.warn(`Materia ${name} no encontrada`);
            throw new Error('Materia no encontrada');
        }
        
        logger.info(`Materia ${name} consultada correctamente`);
        return materia;
    } catch (error) {
        if (error.message === 'Materia no encontrada') {
            throw error;
        }
        logger.error(`Error al consultar materia ${name}: ${error.message}`);
        throw new Error('Error al consultar la materia');
    }
}

/**
 * Filtra materias por nombre
 * @param {Array} materias - Lista de materias
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Materias filtradas
 */
export function filterByName(materias, searchTerm) {
    if (!searchTerm) return materias;
    const term = searchTerm.toLowerCase();
    return materias.filter(m => m.name && m.name.toLowerCase().includes(term));
}

/**
 * Filtra materias por tipo
 * @param {Array} materias - Lista de materias
 * @param {string} searchType - Tipo a buscar
 * @returns {Array} Materias filtradas
 */
export function filterByType(materias, searchType) {
    if (!searchType) return materias;
    const type = searchType.toLowerCase();
    return materias.filter(m => m.type && m.type.toLowerCase().includes(type));
}

/**
 * Ordena materias por un campo específico
 * @param {Array} materias - Lista de materias
 * @param {string} sortBy - Campo por el que ordenar
 * @param {string} order - Orden: 'asc' o 'desc'
 * @returns {Array} Materias ordenadas
 */
export function sortMaterias(materias, sortBy, order = 'asc') {
    if (!sortBy) return materias;
    
    const sortOrder = order === 'desc' ? -1 : 1;
    
    return [...materias].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (typeof aValue === 'string') {
            return sortOrder * aValue.localeCompare(bValue);
        }
        
        return sortOrder * (aValue - bValue);
    });
}

/**
 * Pagina un array de materias
 * @param {Array} materias - Lista de materias
 * @param {number} page - Número de página
 * @param {number} limit - Resultados por página
 * @returns {Object} Materias paginadas con metadatos
 */
export function paginateMaterias(materias, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = materias.length;
    
    return {
        data: materias.slice(startIndex, endIndex),
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: endIndex < total,
            hasPrevPage: page > 1
        }
    };
}
