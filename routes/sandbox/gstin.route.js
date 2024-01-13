const express = require('express');
const router = express.Router();
const gstinController = require('../../controllers/sandbox/gstin.controller')
const checkAuth = require('../../middleware/check-auth')
const queryValidator = require('../../middleware/query-validator')
const bodyValidator = require('../../middleware/body-validator')
const tokenValidator = require('../../middleware/token-validator')

router.get('/search/gstin', queryValidator, gstinController.searchDetailsByGSTINNumber);

router.get('/search/gstin-by-pan', checkAuth, queryValidator, gstinController.searchGSTINNumberByPan);

// router.post('/gst/return/track', checkAuth, bodyValidator, gstinController.trackGSTReturn);

// router.post('/gst/return/track', checkAuth, bodyValidator, gstinController.trackGSTReturn);

// router.post('/gst/tax-payer/registration', checkAuth, bodyValidator, gstinController.registerForGST);

router.post('/gst/tax-payer/generate-otp', checkAuth, bodyValidator, gstinController.generateOTP);

router.post('/gst/tax-payer/verify-otp', checkAuth, bodyValidator, gstinController.verifyOTP);

// router.post('/gst/tax-payer/gstrs/gstr-4/upload', checkAuth, bodyValidator, gstinController.uploadGSTR4);

// router.get('/gst/tax-payer/gstrs/gstr-3b/summary', checkAuth, queryValidator, gstinController.getGstr3bSummary);
// router.post('/gst/tax-payer/gstrs/gstr-3b/upload', checkAuth, bodyValidator, gstinController.uploadGstr3b);
// router.post('/gst/tax-payer/gstrs/gstr-3b/submit', checkAuth, bodyValidator, gstinController.submitGstr3b);

// router.get('/gst/tax-payer/gstrs/gstr-2a', checkAuth, queryValidator, gstinController.gstr2a);
// router.get('/gst/tax-payer/gstrs/gstr-2a/b2b', checkAuth, queryValidator, gstinController.gstr2aB2B);
// router.get('/gst/tax-payer/gstrs/gstr-2a/b2ba', checkAuth, queryValidator, gstinController.gstr2aB2BA);
// router.get('/gst/tax-payer/gstrs/gstr-2a/cdn', checkAuth, queryValidator, gstinController.gstr2aCDN);
// router.get('/gst/tax-payer/gstrs/gstr-2a/cdna', checkAuth, queryValidator, gstinController.gstr2aCDNA);
// router.get('/gst/tax-payer/gstrs/gstr-2a/isd', checkAuth, queryValidator, gstinController.gstr2aISD);


// GSTR1 routes


router.get('/gst/tax-payer/gstrs/gstr-1/at', checkAuth, queryValidator, gstinController.gstr1AT);
// router.get('/gst/tax-payer/gstrs/gstr-1/ata', checkAuth, queryValidator, gstinController.gstr1ATA);
// router.get('/gst/tax-payer/gstrs/gstr-1/b2b', checkAuth, queryValidator, gstinController.gstr1B2B);
// router.get('/gst/tax-payer/gstrs/gstr-1/b2ba', checkAuth, queryValidator, gstinController.gstr1B2BA);
// router.get('/gst/tax-payer/gstrs/gstr-1/b2cl', checkAuth, queryValidator, gstinController.gstr1B2CL);
// router.get('/gst/tax-payer/gstrs/gstr-1/b2cla', checkAuth, queryValidator, gstinController.gstr1B2CLA);
// router.get('/gst/tax-payer/gstrs/gstr-1/b2cs', checkAuth, queryValidator, gstinController.gstr1B2CS);
// router.get('/gst/tax-payer/gstrs/gstr-1/b2csa', checkAuth, queryValidator, gstinController.gstr1B2CSA);
// router.get('/gst/tax-payer/gstrs/gstr-1/cdnr', checkAuth, queryValidator, gstinController.gstr1CDNR);
// router.get('/gst/tax-payer/gstrs/gstr-1/cdnra', checkAuth, queryValidator, gstinController.gstr1CDNRA);
// router.get('/gst/tax-payer/gstrs/gstr-1/cdnur', checkAuth, queryValidator, gstinController.gstr1CDNUR);
// router.get('/gst/tax-payer/gstrs/gstr-1/cdnura', checkAuth, queryValidator, gstinController.gstr1CDNURA);
// router.get('/gst/tax-payer/gstrs/gstr-1/doc-issued', checkAuth, queryValidator, gstinController.gstr1DocIssue);
// router.get('/gst/tax-payer/gstrs/gstr-1/exp', checkAuth, queryValidator, gstinController.gstr1Exp);
// router.get('/gst/tax-payer/gstrs/gstr-1/expa', checkAuth, queryValidator, gstinController.gstr1Expa);
// router.get('/gst/tax-payer/gstrs/gstr-1/summary', checkAuth, queryValidator, gstinController.gstr1Summary);
// router.get('/gst/tax-payer/gstrs/gstr-1/hsn-summary', checkAuth, queryValidator, gstinController.gstr1HSN);
// router.get('/gst/tax-payer/gstrs/gstr-1/nil-supplies', checkAuth, queryValidator, gstinController.gstr1NIL);
// router.post('/gst/tax-payer/gstrs/gstr-1/upload', checkAuth, bodyValidator, gstinController.uploadGSTR1);
// router.post('/gst/tax-payer/gstrs/gstr-1/submit', checkAuth, bodyValidator, gstinController.submitGSTR1);
// router.post('/gst/tax-payer/gstrs/gstr-1/file', checkAuth, bodyValidator, gstinController.fileGSTR1);
// router.get('/gst/tax-payer/gstrs/gstr-1/generate-evc', checkAuth, queryValidator, gstinController.fileGSTR1);


router.post('/insert-gst-search', gstinController.saveGstSearch);

module.exports = router;
