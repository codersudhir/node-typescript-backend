const express = require('express');
const router = express.Router();
const hsnController = require('../controllers/hsn.controller')
router.get('/getHsn', hsnController.getHsnCode);
router.get('/getSac', hsnController.getSacCode);
router.get('/getHsnAll', hsnController.getHsnAll);
router.get('/getSacAll', hsnController.getSacAll);
module.exports = router;