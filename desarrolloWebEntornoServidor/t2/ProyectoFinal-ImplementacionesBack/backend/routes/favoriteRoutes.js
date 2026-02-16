const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addFavorite, listFavorites, removeFavorite } = require("../controllers/favoriteController");

const router = express.Router();

router.get("/", authMiddleware, listFavorites);
router.post("/", authMiddleware, addFavorite);
router.delete("/:recipeId", authMiddleware, removeFavorite);

module.exports = router;
