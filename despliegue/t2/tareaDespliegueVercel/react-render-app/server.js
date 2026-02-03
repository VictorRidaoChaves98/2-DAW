const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos simulada (en memoria)
let tareas = [
    { id: 1, titulo: 'Comprar pan', descripcion: 'Luego voy al chino por pan' },
    { id: 2, titulo: 'Limpiar el cuarto', descripcion: 'Limpiar y organizar el cuarto' },
    { id: 3, titulo: 'Estudiar Despliegue', descripcion: 'Para saber desplegar en Render' }
];

let nextId = 4;

// ============= RUTAS =============

// GET /tareas - Obtener todas las tareas
app.get('/tareas', (req, res) => {
    res.json({
        success: true,
        mensaje: 'Lista de tareas obtenida correctamente',
        data: tareas,
        total: tareas.length
    });
});

// GET /tareas/:id - Obtener una tarea específica
app.get('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const tarea = tareas.find(t => t.id === parseInt(id));

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
});

// POST /tareas - Crear una nueva tarea
app.post('/tareas', (req, res) => {
    const { titulo, descripcion } = req.body;

    // Validar que se proporcionen los datos requeridos
    if (!titulo || !descripcion) {
        return res.status(400).json({
            success: false,
            mensaje: 'El título y la descripción son obligatorios',
            data: null
        });
    }

    // Crear nueva tarea
    const nuevaTarea = {
        id: nextId++,
        titulo,
        descripcion
    };

    tareas.push(nuevaTarea);

    res.status(201).json({
        success: true,
        mensaje: 'Tarea creada correctamente',
        data: nuevaTarea
    });
});

// DELETE /tareas/:id - Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const index = tareas.findIndex(t => t.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({
            success: false,
            mensaje: 'Tarea no encontrada',
            data: null
        });
    }

    const tareaEliminada = tareas.splice(index, 1);

    res.json({
        success: true,
        mensaje: 'Tarea eliminada correctamente',
        data: tareaEliminada[0]
    });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API REST de Tareas',
        version: '1.0.0',
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
    console.log(`Server ejecutandose en http://localhost:${PORT}`);
    console.log(`API de Tareas en http://localhost:${PORT}/tareas`);
});

module.exports = app;
