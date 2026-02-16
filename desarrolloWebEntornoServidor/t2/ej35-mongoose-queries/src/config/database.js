import mongoose from 'mongoose';

/**
 * Conecta a una base de datos de MongoDB
 * @param {string} dbName - Nombre de la base de datos
 * @returns {Promise<void>}
 */
export async function connectDB(dbName) {
    try {
        await mongoose.connect(`mongodb://localhost:27017/${dbName}`);
        console.log(`✓ Conectado a MongoDB (${dbName})`);
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        throw error;
    }
}

/**
 * Cierra la conexión a MongoDB
 * @returns {Promise<void>}
 */
export async function closeDB() {
    try {
        await mongoose.connection.close();
        console.log('✓ Conexión cerrada');
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
        throw error;
    }
}
