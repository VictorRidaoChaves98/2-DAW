const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createRecipe, listRecipes, getRecipe } = require("../controllers/recipeController");

const router = express.Router();

router.get("/", listRecipes);
router.get("/:id", getRecipe);
router.post("/", authMiddleware, createRecipe);

module.exports = router;
