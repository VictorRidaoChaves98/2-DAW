const Rating = require("../models/Rating");

const addRating = async (req, res, next) => {
  try {
    const { recipe, score, comment } = req.body;
    if (!recipe || !score) {
      return res.status(400).json({ message: "recipe and score are required" });
    }

    const rating = await Rating.create({
      user: req.user.id,
      recipe,
      score,
      comment
    });

    return res.status(201).json({ rating });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Already rated" });
    }
    return next(error);
  }
};

const listRatingsForRecipe = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ recipe: req.params.recipeId }).populate("user");
    return res.json({ ratings });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addRating,
  listRatingsForRecipe
};
