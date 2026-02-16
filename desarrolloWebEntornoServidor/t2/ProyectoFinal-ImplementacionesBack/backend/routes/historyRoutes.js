const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addEntry, listHistory } = require("../controllers/historyController");

const router = express.Router();

router.get("/", authMiddleware, listHistory);
router.post("/", authMiddleware, addEntry);

module.exports = router;
