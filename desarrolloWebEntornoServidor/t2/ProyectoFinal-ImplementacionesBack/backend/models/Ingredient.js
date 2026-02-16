const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    caloriesPer100g: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ingredient", ingredientSchema);
