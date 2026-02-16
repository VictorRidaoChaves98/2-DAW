const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docs.controller');

router.post('/markdown', docsController.generateMarkdown);
router.post('/pdf', docsController.generatePdf);
router.post('/uml', docsController.generateUml);

// Get generated outputs by history id
router.get('/:id', docsController.getById);

// Download generated file by type: markdown | pdf | uml
router.get('/:id/download/:type', docsController.download);

module.exports = router;
