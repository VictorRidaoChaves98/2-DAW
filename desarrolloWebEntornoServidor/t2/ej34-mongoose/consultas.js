const mongoose = require('mongoose');
const Movie = require('./models/movie');
require('./config/db');

async function run() {
    try {
        console.log('=== Conectado a MongoDB ===\n');

        const peliTitulo = await Movie.findOne({ title: 'The Land Beyond the Sunset' });
        console.log('1️⃣ Película por título:\n', peliTitulo, '\n');

        const count2012 = await Movie.countDocuments({ year: 1912 });
        console.log('2️⃣ Películas estrenadas en 1912:', count2012, '\n');

        const dramas = await Movie.find({ genres: 'Drama' }).limit(5);
        console.log('3️⃣ Primeras 5 películas Drama:\n', dramas, '\n');

        const topMovies = await Movie.find({ 'imdb.rating': { $gte: 8 } }).limit(5);
        console.log('4️⃣ Primeras 5 películas con rating >= 8:\n', topMovies, '\n');

        const commentedMovies = await Movie.find({ num_mflix_comments: { $gt: 0 } }).limit(5);
        console.log('5️⃣ Primeras 5 películas con comentarios:\n', commentedMovies, '\n');

    } catch (err) {
        console.error('Error en la consulta:', err);
    } finally {
        mongoose.disconnect();
        console.log('=== Conexión cerrada ===');
    }
}

run();
