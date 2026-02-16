const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createIngredient, listIngredients } = require("../controllers/ingredientController");

const router = express.Router();

router.get("/", listIngredients);
router.post("/", authMiddleware, createIngredient);

module.exports = router;
