const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Hook pre-save: normalizar email a minúsculas
userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Hook pre-save: capitalizar el nombre
userSchema.pre('save', function (next) {
  if (this.name) {
    this.name = this.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  next();
});

// Hook post-save: mostrar mensaje en consola
userSchema.post('save', function (doc) {
  console.log(`✅ Usuario guardado: ${doc.name} (${doc.email})`);
});

// Hook pre-updateOne: normalizar email si se actualiza
userSchema.pre('updateOne', function (next) {
  if (this._update.email) {
    this._update.email = this._update.email.toLowerCase();
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
