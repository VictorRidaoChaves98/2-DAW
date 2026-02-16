import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor FitFood escuchando en puerto ${PORT}`);
    console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
