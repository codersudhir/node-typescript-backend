const express = require('express');
const taxPaymentApiController = require('../../controllers/sandbox/taxPaymentApi.controller');
const router = express.Router();
const checkAuth = require('../../middleware/check-auth')
const queryValidator = require('../../middleware/query-validator')

router.get('/get',checkAuth,queryValidator,taxPaymentApiController.getChallan)

module.exports = router;
