const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");
const historyRoutes = require("./routes/historyRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ status: "ok", name: "FitFood API" });
});

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/ratings", ratingRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
