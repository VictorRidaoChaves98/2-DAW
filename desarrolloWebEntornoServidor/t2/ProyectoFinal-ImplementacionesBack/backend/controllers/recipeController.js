const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

const calculateTotalCalories = async (ingredients) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) return 0;

  const ingredientIds = ingredients.map((item) => item.ingredient);
  const ingredientDocs = await Ingredient.find({ _id: { $in: ingredientIds } });
  const caloriesMap = new Map(
    ingredientDocs.map((ing) => [ing._id.toString(), ing.caloriesPer100g])
  );

  return ingredients.reduce((sum, item) => {
    const caloriesPer100g = caloriesMap.get(item.ingredient.toString()) || 0;
    const grams = Number(item.grams) || 0;
    return sum + (caloriesPer100g * grams) / 100;
  }, 0);
};

const createRecipe = async (req, res, next) => {
  try {
    const { name, description, ingredients, isOfficial } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const totalCalories = await calculateTotalCalories(ingredients);
    const canOfficial = req.user.role === "nutritionist" || req.user.role === "admin";

    const recipe = await Recipe.create({
      name,
      description,
      ingredients,
      totalCalories,
      createdBy: req.user.id,
      isOfficial: canOfficial ? Boolean(isOfficial) : false
    });

    return res.status(201).json({ recipe });
  } catch (error) {
    return next(error);
  }
};

const listRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    return res.json({ recipes });
  } catch (error) {
    return next(error);
  }
};

const getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("ingredients.ingredient");
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.json({ recipe });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRecipe,
  listRecipes,
  getRecipe
};
