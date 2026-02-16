const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addRating, listRatingsForRecipe } = require("../controllers/ratingController");

const router = express.Router();

router.get("/recipe/:recipeId", listRatingsForRecipe);
router.post("/", authMiddleware, addRating);

module.exports = router;
