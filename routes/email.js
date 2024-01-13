const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email.controller')
router.post('/otp', emailController.sendOtpEmail);
router.post('/verify', emailController.verifyEmail);
router.post('/verify-forgot-pass', emailController.veriForgotPassword);
// router.get('/cards', cmsController.getCards);
// router.get('/navCards', cmsController.getNavCards);
// router.get('/content', cmsController.getContent);
// router.get('/ongoingPro', cmsController.getongoingPro);
// router.get('/corporatePro', cmsController.getCorporatePro);
module.exports = router;