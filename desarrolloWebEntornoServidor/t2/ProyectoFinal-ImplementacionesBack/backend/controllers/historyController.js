const History = require("../models/History");
const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");

const normalizeDate = (value) => {
  const date = value ? new Date(value) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const addEntry = async (req, res, next) => {
  try {
    const { date, ingredient, recipe, grams } = req.body;
    if (!ingredient && !recipe) {
      return res.status(400).json({ message: "ingredient or recipe is required" });
    }

    const gramsValue = Number(grams) || 0;
    if (gramsValue <= 0) {
      return res.status(400).json({ message: "grams must be greater than 0" });
    }

    const day = normalizeDate(date);
    let calories = 0;

    if (ingredient) {
      const ingredientDoc = await Ingredient.findById(ingredient);
      if (!ingredientDoc) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      calories = (ingredientDoc.caloriesPer100g * gramsValue) / 100;
    }

    if (recipe) {
      const recipeDoc = await Recipe.findById(recipe);
      if (!recipeDoc) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      calories = recipeDoc.totalCalories;
    }

    const entry = {
      ingredient: ingredient || undefined,
      recipe: recipe || undefined,
      grams: gramsValue,
      calories
    };

    const history = await History.findOneAndUpdate(
      { user: req.user.id, date: day },
      {
        $setOnInsert: { user: req.user.id, date: day },
        $push: { entries: entry },
        $inc: { totalCalories: calories }
      },
      { new: true, upsert: true }
    );

    return res.status(201).json({ history });
  } catch (error) {
    return next(error);
  }
};

const listHistory = async (req, res, next) => {
  try {
    const history = await History.find({ user: req.user.id }).sort({ date: -1 });
    return res.json({ history });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addEntry,
  listHistory
};
