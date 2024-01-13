const express = require('express');
const router = express.Router();
const mcaController = require('../../controllers/sandbox/mca.controller')
const checkAuth = require('../../middleware/check-auth')
const queryValidator = require('../../middleware/query-validator')

router.get('/company-details', checkAuth, queryValidator, mcaController.getCompanyByCIN);

module.exports = router;
