import logger from "../utils/logger.js";

// Middleware de manejo de errores
export default function errorHandler(err, req, res, next) {
    // Registrar el error en Winston
    logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

    // Enviar respuesta al cliente
    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor"
    });
}
