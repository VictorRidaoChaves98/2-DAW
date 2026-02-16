import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
    {
        title: String,
        genres: [String],
        year: Number,
        rated: String,
        type: String
    },
    { collection: 'movies', strict: false }
);

const commentSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        text: String,
        movie_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        },
        date: Date
    },
    { collection: 'comments', strict: false }
);

export const Movie = mongoose.model('Movie', movieSchema);
export const Comment = mongoose.model('Comment', commentSchema);
