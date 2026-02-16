const mongoose = require('mongoose');

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
    { collection: 'comments' }
);

module.exports = mongoose.model('Comment', commentSchema);
