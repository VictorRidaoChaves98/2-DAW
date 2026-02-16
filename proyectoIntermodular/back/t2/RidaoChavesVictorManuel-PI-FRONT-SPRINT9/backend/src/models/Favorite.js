import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe',
            required: true,
        },
    },
    { timestamps: true }
);

// Asegurar que no haya duplicados
favoriteSchema.index({ usuario: 1, receta: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
