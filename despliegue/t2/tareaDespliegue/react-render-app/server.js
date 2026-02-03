require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const Tarea = require('./models/Tarea');

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

// GET /tareas - Obtener todas las tareas
app.get('/tareas', async (req, res) => {
    try {
        const tareas = await Tarea.find().sort({ createdAt: -1 });
        
        res.json({
            success: true,
            mensaje: 'Lista de tareas obtenida correctamente',
            data: tareas,
            total: tareas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener las tareas',
            error: error.message
        });
    }
});

// GET /tareas/:id - Obtener una tarea específica
app.get('/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tarea = await Tarea.findById(id);

        if (!tarea) {
            return res.status(404).json({
                success: false,
                mensaje: 'Tarea no encontrada',
                data: null
            });
        }

        res.json({
            success: true,
            mensaje: 'Tarea obtenida correctamente',
            data: tarea
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener la tarea',
            error: error.message
        });
    }
});

// POST /tareas - Crear una nueva tarea
app.post('/tareas', async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;

        // Validar que se proporcionen los datos requeridos
        if (!titulo || !descripcion) {
            return res.status(400).json({
                success: false,
                mensaje: 'El título y la descripción son obligatorios',
                data: null
            });
        }

        // Crear nueva tarea en MongoDB
        const nuevaTarea = new Tarea({
            titulo,
            descripcion
        });

        await nuevaTarea.save();

        res.status(201).json({
            success: true,
            mensaje: 'Tarea creada correctamente',
            data: nuevaTarea
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear la tarea',
            error: error.message
        });
    }
});

// DELETE /tareas/:id - Eliminar una tarea
app.delete('/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tareaEliminada = await Tarea.findByIdAndDelete(id);

        if (!tareaEliminada) {
            return res.status(404).json({
                success: false,
                mensaje: 'Tarea no encontrada',
                data: null
            });
        }

        res.json({
            success: true,
            mensaje: 'Tarea eliminada correctamente',
            data: tareaEliminada
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar la tarea',
            error: error.message
        });
    }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API REST de Tareas con MongoDB',
        version: '2.0.0',
        database: 'MongoDB Atlas',
        rutas: {
            'GET /tareas': 'Obtener todas las tareas',
            'GET /tareas/:id': 'Obtener una tarea específica',
            'POST /tareas': 'Crear una nueva tarea',
            'DELETE /tareas/:id': 'Eliminar una tarea'
        }
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
    console.log(`📝 API de Tareas disponible en http://localhost:${PORT}/tareas`);
});

module.exports = app;
