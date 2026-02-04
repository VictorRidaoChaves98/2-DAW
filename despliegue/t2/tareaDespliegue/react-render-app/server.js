require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const Favorito = require('./models/Favorito');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middleware - Configuración de CORS
const corsOptions = {
    origin: [
        'https://tarea-despliegue-brown.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// ============= RUTAS =============

// GET /favoritos - Obtener todos los audiodiarios favoritos
app.get('/favoritos', async (req, res) => {
    try {
        const favoritos = await Favorito.find().sort({ fecha_guardado: -1 });
        
        res.json({
            success: true,
            mensaje: 'Lista de favoritos obtenida correctamente',
            data: favoritos,
            total: favoritos.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener los favoritos',
            error: error.message
        });
    }
});

// GET /favoritos/:id - Obtener un audiodiario favorito específico
app.get('/favoritos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const favorito = await Favorito.findById(id);

        if (!favorito) {
            return res.status(404).json({
                success: false,
                mensaje: 'Favorito no encontrado',
                data: null
            });
        }

        res.json({
            success: true,
            mensaje: 'Favorito obtenido correctamente',
            data: favorito
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el favorito',
            error: error.message
        });
    }
});

// POST /favoritos - Añadir un nuevo audiodiario a favoritos
app.post('/favoritos', async (req, res) => {
    try {
        const { juego, nombre, numero, descripcion } = req.body;

        // Validar que se proporcionen los datos requeridos
        if (!juego || !nombre || !numero || !descripcion) {
            return res.status(400).json({
                success: false,
                mensaje: 'El juego, nombre, número y descripción son obligatorios',
                data: null
            });
        }

        // Validar que el juego sea uno de los disponibles
        const juegosValidos = ['Bioshock 1', 'Bioshock 2', 'Bioshock Infinite'];
        if (!juegosValidos.includes(juego)) {
            return res.status(400).json({
                success: false,
                mensaje: 'El juego especificado no es válido',
                data: null
            });
        }

        // Crear nuevo favorito en MongoDB
        const nuevoFavorito = new Favorito({
            juego,
            nombre,
            numero,
            descripcion
        });

        await nuevoFavorito.save();

        res.status(201).json({
            success: true,
            mensaje: 'Audiodiario añadido a favoritos correctamente',
            data: nuevoFavorito
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al añadir el audiodiario a favoritos',
            error: error.message
        });
    }
});

// DELETE /favoritos/:id - Eliminar un audiodiario de favoritos
app.delete('/favoritos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const favoritoEliminado = await Favorito.findByIdAndDelete(id);

        if (!favoritoEliminado) {
            return res.status(404).json({
                success: false,
                mensaje: 'Favorito no encontrado',
                data: null
            });
        }

        res.json({
            success: true,
            mensaje: 'Audiodiario eliminado de favoritos correctamente',
            data: favoritoEliminado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el audiodiario de favoritos',
            error: error.message
        });
    }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API REST de Audiodiarios Bioshock con MongoDB',
        version: '2.0.0',
        database: 'MongoDB Atlas',
        rutas: {
            'GET /favoritos': 'Obtener todos los audiodiarios favoritos',
            'GET /favoritos/:id': 'Obtener un audiodiario favorito específico',
            'POST /favoritos': 'Añadir un nuevo audiodiario a favoritos',
            'DELETE /favoritos/:id': 'Eliminar un audiodiario de favoritos'
        },
        juegosDisponibles: ['Bioshock 1', 'Bioshock 2', 'Bioshock Infinite']
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        mensaje: 'Ruta no encontrada',
        data: null
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`🎮 API de Audiodiarios Bioshock disponible en http://localhost:${PORT}/favoritos`);
});

module.exports = app;
