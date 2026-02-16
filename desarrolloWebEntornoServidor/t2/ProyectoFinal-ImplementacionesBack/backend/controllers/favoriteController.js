const Favorite = require("../models/Favorite");

const addFavorite = async (req, res, next) => {
  try {
    const { recipe } = req.body;
    if (!recipe) {
      return res.status(400).json({ message: "recipe is required" });
    }

    const favorite = await Favorite.create({ user: req.user.id, recipe });
    return res.status(201).json({ favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Already in favorites" });
    }
    return next(error);
  }
};

const listFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate("recipe");
    return res.json({ favorites });
  } catch (error) {
    return next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    await Favorite.deleteOne({ user: req.user.id, recipe: req.params.recipeId });
    return res.json({ message: "Removed" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addFavorite,
  listFavorites,
  removeFavorite
};
