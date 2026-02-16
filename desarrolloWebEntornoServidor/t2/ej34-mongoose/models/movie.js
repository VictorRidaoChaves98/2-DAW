const { Schema, model } = require('mongoose');

const movieSchema = new Schema({
    title: String,
    year: Number,
    genres: [String],
    directors: [String],
    imdb: {
        rating: Number,
        votes: Number,
        id: Number
    },
    countries: [String],
    languages: [String]
});

const Movie = model('Movie', movieSchema);
module.exports = Movie;
