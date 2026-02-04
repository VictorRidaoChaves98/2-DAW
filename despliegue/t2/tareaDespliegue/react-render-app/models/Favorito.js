const mongoose = require('mongoose');

const favoritoSchema = new mongoose.Schema({
    juego: {
        type: String,
        required: [true, 'El juego es obligatorio'],
        enum: ['Bioshock 1', 'Bioshock 2', 'Bioshock Infinite'],
        trim: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del audiodiario es obligatorio'],
        trim: true
    },
    numero: {
        type: Number,
        required: [true, 'El número es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    fecha_guardado: {
        type: Date,
        default: Date.now
    }
});

// Método para obtener el JSON sin __v
favoritoSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Favorito = mongoose.model('Favorito', favoritoSchema);

module.exports = Favorito;
