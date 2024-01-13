const express = require('express');
const router = express.Router();
const bankController = require('../../controllers/sandbox/bank.controller')
const checkAuth = require('../../middleware/check-auth')
const queryValidator = require('../../middleware/query-validator')
const bodyValidator = require('../../middleware/body-validator')

router.use((req, res, next) => {
    console.log('in here');
    next()
})

router.get('/get-details', checkAuth, queryValidator, bankController.getBankDetailsByIfsc);

router.post('/verify-account', checkAuth, bodyValidator, bankController.verifyBankAccount);

module.exports = router;
