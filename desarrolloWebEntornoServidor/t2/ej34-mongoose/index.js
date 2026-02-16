const mongoose = require('mongoose');
const db = require('./config/db');
const Movie = require('./models/movie');

async function test() {
    const movie = await Movie.findOne(); // Devuelve una película de ejemplo
    console.log(movie);
}

test().then(() => mongoose.disconnect());
