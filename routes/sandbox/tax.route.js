const express = require('express');
const taxController = require('../../controllers/sandbox/taxController');
const router = express.Router();
const checkAuth = require('../../middleware/check-auth')
const queryValidator = require('../../middleware/query-validator')

router.get('/get-cash-itc-balence',checkAuth, queryValidator,taxController.cashItcBalance);
router.get('/get-itc-chash-ledgers',checkAuth, queryValidator,taxController.cashLedger);
router.get('/get-itc-legers',checkAuth, queryValidator,taxController.itcLedgers);
router.get('/tax-liability-legers',checkAuth, queryValidator,taxController.tax_liability_ledger);
router.get('/other-ledgers',checkAuth, queryValidator,taxController.other_Ledger);
router.get('/return-related-liability-balnce',checkAuth, queryValidator,taxController.return_related_liability_balance);

module.exports = router;
