const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    colorList: {
      type: [String],
      default: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
    },
    selectedColor: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Validar que selectedColor esté en el array colorList
          return this.colorList.includes(value);
        },
        message:
          'El color seleccionado debe estar en la lista de colores disponibles',
      },
    },
  },
  { timestamps: true }
);

// Validación personalizada adicional
colorSchema.pre('save', function (next) {
  if (!this.colorList || this.colorList.length === 0) {
    const err = new Error('La lista de colores no puede estar vacía');
    next(err);
  } else {
    next();
  }
});

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
