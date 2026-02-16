import axios from 'axios';
import logger from '../utils/logger.js';

const API_BASE_URL = 'https://crisis-core-materia-fusion-api-546461677134.us-central1.run.app';

/**
 * Función base para realizar peticiones HTTP
 * @param {string} endpoint - Ruta del endpoint
 * @param {string} method - Método HTTP (GET, POST, etc.)
 * @param {Object} options - Opciones adicionales de la petición
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function sendRequest(endpoint, method = 'GET', options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            method,
            url,
            ...options
        };

        logger.info(`${method} ${url}`);
        const response = await axios(config);
        return response.data;
    } catch (error) {
        logger.error(`Error en ${method} ${endpoint}: ${error.message}`);
        throw error;
    }
}

/**
 * Realiza una petición GET a la API
 * @param {string} endpoint - Ruta del endpoint
 * @param {Object} params - Parámetros de query
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function get(endpoint, params = {}) {
    return sendRequest(endpoint, 'GET', { params });
}

/**
 * Realiza una petición POST a la API
 * @param {string} endpoint - Ruta del endpoint
 * @param {Object} body - Cuerpo de la petición
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function post(endpoint, body) {
    return sendRequest(endpoint, 'POST', { data: body });
}

/**
 * Realiza una petición PATCH a la API
 * @param {string} endpoint - Ruta del endpoint
 * @param {Object} body - Cuerpo de la petición
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function patch(endpoint, body) {
    return sendRequest(endpoint, 'PATCH', { data: body });
}

/**
 * Realiza una petición DELETE a la API
 * @param {string} endpoint - Ruta del endpoint
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function del(endpoint) {
    return sendRequest(endpoint, 'DELETE');
}

/**
 * Obtiene la URL base de la API
 * @returns {string} URL base
 */
export function getBaseUrl() {
    return API_BASE_URL;
}
