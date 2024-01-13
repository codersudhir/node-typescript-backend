const express = require('express');
const router = express.Router();
const calcController = require('../controllers/calculator.controller')
// const checkAuth = require('../../middleware/check-auth')
const bodyValidator = require('../middleware/body-validator')

router.post('/fixed-deposit', calcController.calFDReturn);

router.post('/simple-interest', calcController.calSimpleInterest);

router.post('/compound-interest', calcController.calCompoundInterest);

router.post('/emi', calcController.emi);

router.post('/home-loan-emi', calcController.emi);

router.post('/calculate-home-loan-eligibility', calcController.homeLoanEligibility);

router.post('/depreciation', calcController.depreciation);

router.post('/car-loan-emi', calcController.emi);

router.post('/business-loan-emi', calcController.emi);

// router.post('/epf', calcController.epf);

router.post('/personal-loan-emi', calcController.emi);

router.post('/post-office-mis', calcController.mis);

router.post('/cagr', calcController.CAGR);

router.post('/sip-gain', calcController.calSIPGain);

router.post('/nps-returns', calcController.calNPSGain);

router.post('/lump-sum', calcController.calLumpSumGain);

router.post('/recursive-deposit', calcController.calRDReturn);

router.post('/hra', calcController.calcHra);

router.post('/capital-gain-calculator', calcController.capitalGain);

router.post('/gst-calculator', calcController.gstCalculator);

module.exports = router;