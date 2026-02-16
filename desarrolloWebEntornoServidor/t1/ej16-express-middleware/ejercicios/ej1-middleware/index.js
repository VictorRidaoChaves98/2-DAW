const express = require('express');
const morgan = require('morgan');
const winston = require('winston');

const app = express();
const port = 3000;

// --------------------
// Configuración de Winston
// --------------------
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
            )
        })
    ],
    exitOnError: false
});

// --------------------
// Morgan → Winston
// --------------------
app.use(morgan(':method :url :status', {
    stream: {
        write: (message) => {
            const parts = message.trim().split(' ');
            const status = parseInt(parts[2]);

            if (status >= 500) logger.error(message.trim());
            else if (status >= 400) logger.warn(message.trim());
            else logger.info(message.trim());
        }
    }
}));

// --------------------
// Middleware Admin
// --------------------
function adminMiddleware(req, res, next) {
    const password = req.headers.password;

    if (password === 'patata') {
        return next();
    }

    const error = new Error("Acceso restringido, por favor, incluya la palabra secreta en 'password'");
    error.statusCode = 401;
    return next(error);
}

// --------------------
// Rutas
// --------------------
app.get('/', (req, res) => res.send('Hola Mundo!'));
app.get('/error', (req, res) => res.status(500).send('Error de prueba'));
app.get('/notfound', (req, res) => res.status(404).send('No encontrado'));

// Ruta protegida
app.get('/admin', adminMiddleware, (req, res) => {
    res.status(200).send("Bienvenid@, disfrute del contenido");
});

// --------------------
// Middleware de errores (obligatorio en ejercicio)
// --------------------
app.use((err, req, res, next) => {
    const statusCode = err.statusCode ?? 500;

    logger.error(`ERROR: ${err.message}`);

    res.status(statusCode).json({
        code: statusCode,
        message: statusCode === 500 ? "Server Error" : err.message
    });
});

// --------------------
// Escuchar puerto
// --------------------
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
