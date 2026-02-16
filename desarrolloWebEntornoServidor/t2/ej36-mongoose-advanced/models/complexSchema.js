const mongoose = require('mongoose');

// Primero definir el esquema de Author para usar ObjectId
const authorSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const Author = mongoose.model('Author', authorSchema);

// Esquema principal con tipos avanzados
const complexSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    // Array de strings
    tags: {
      type: [String],
      default: [],
    },

    // Array de números
    ratings: {
      type: [Number],
      default: [],
    },

    // Objeto anidado
    metadata: {
      type: {
        views: Number,
        likes: Number,
        comments: Number,
      },
      default: { views: 0, likes: 0, comments: 0 },
    },

    // Array de objetos anidados
    reviews: [
      {
        author: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Map (clave-valor)
    properties: {
      type: Map,
      of: String,
      default: new Map(),
    },

    // ObjectId con referencia a otra colección
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },

    // Mixed type (cualquier tipo de dato)
    extraData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const ComplexSchema = mongoose.model('ComplexSchema', complexSchema);

module.exports = {
  ComplexSchema,
  Author,
};
