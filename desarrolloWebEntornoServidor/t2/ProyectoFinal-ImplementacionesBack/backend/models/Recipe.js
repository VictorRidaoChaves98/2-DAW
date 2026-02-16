const mongoose = require("mongoose");

const recipeIngredientSchema = new mongoose.Schema(
  {
    ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient", required: true },
    grams: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isOfficial: { type: Boolean, default: false },
    ingredients: { type: [recipeIngredientSchema], default: [] },
    totalCalories: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
