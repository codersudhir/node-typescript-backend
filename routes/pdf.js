const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf.controller')

router.post('/merge-pdf', pdfController.mergePdf);
router.post('/pdf-to-img', pdfController.pdfToImage);

module.exports = router;