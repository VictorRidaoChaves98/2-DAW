const express = require("express");
const fibonacciRouter = require("../routes/fibonacciRoutes");

module.exports = function (app) {
    app.use(express.json());

    // Rutas
    app.use("/fibonacci", fibonacciRouter);
};
