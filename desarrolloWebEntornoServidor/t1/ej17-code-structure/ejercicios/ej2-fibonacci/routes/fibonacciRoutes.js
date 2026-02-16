const express = require("express");
const router = express.Router();
const fibonacciController = require("../controllers/fibonacciController");

router.get("/:n", fibonacciController.getFibonacci);

module.exports = router;
