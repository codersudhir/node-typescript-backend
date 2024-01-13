const express = require('express');
const router = express.Router();
const aadharController = require('../../controllers/sandbox/aadhar.controller');
const panController = require('../../controllers/sandbox/pan.controller')
const checkAuth = require('../../middleware/check-auth')
const queryValidator = require('../../middleware/query-validator')

router.get('/check-pan-aadhaar-status', checkAuth, queryValidator, panController.checkPanAADHARStatus);

router.get('/get-pan-details', checkAuth, queryValidator, panController.getAdvancePanDetails);
router.get('/verify_aadhar',checkAuth, queryValidator,aadharController.verifyAadhaar);

module.exports = router;
