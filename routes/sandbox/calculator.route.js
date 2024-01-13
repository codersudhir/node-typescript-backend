const express = require('express');
const router = express.Router();
const calcController = require('../../controllers/sandbox/calculator.controller')
const calcRoutes = require('../calculator.route')
const checkAuth = require('../../middleware/check-auth')
const bodyValidator = require('../../middleware/body-validator')

router.post('/income-tax/new-regime', checkAuth, bodyValidator, calcController.incomeTaxNewRegime);

router.post('/income-tax/old-regime', checkAuth, bodyValidator, calcController.incomeTaxOldRegime);

router.post('/advance-income-tax/old-regime', checkAuth, bodyValidator, calcController.advanceIncomeTaxOldRegime);

router.post('/advance-income-tax/new-regime', checkAuth, bodyValidator, calcController.advanceIncomeTaxNewRegime);

router.post('/tds', checkAuth, bodyValidator, calcController.calculateTDS);

router.use('/miscellaneous', calcRoutes)

module.exports = router;
