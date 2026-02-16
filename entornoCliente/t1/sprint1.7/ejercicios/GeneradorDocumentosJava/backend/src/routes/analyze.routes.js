const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB
const router = express.Router();
const analyzeController = require('../controllers/analyze.controller');

// Demo GET /api/analyze
router.get('/', analyzeController.demo);

// POST /api/analyze with { code } or { path } or multipart form with file field 'archive' (zip)
router.post('/', upload.single('archive'), analyzeController.analyze);

module.exports = router;
