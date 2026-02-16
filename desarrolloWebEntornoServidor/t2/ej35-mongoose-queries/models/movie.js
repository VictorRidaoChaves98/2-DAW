const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
    {
        title: String,
        genres: [String],
        year: Number,
        rated: String,
        type: String
    },
    { collection: 'movies' }
);

module.exports = mongoose.model('Movie', movieSchema);
