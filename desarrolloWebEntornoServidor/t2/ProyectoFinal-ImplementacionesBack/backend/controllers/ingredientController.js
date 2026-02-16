const Ingredient = require("../models/Ingredient");

const createIngredient = async (req, res, next) => {
  try {
    const { name, caloriesPer100g } = req.body;
    if (!name || caloriesPer100g === undefined) {
      return res.status(400).json({ message: "name and caloriesPer100g are required" });
    }

    const ingredient = await Ingredient.create({ name, caloriesPer100g });
    return res.status(201).json({ ingredient });
  } catch (error) {
    return next(error);
  }
};

const listIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    return res.json({ ingredients });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createIngredient,
  listIngredients
};
