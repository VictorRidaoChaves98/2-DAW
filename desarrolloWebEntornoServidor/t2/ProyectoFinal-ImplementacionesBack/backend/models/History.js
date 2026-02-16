const mongoose = require("mongoose");

const historyEntrySchema = new mongoose.Schema(
  {
    ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    grams: { type: Number, required: true, min: 0 },
    calories: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    entries: { type: [historyEntrySchema], default: [] },
    totalCalories: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

historySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("History", historySchema);
