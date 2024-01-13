const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const cmsController = require('../controllers/cms.controller')
const emailController = require('../controllers/email.controller')

router.post('/sign-up', userController.create);
router.post('/login', userController.login);
router.post('/sign-in-with-otp', userController.logInWithOtp);
router.post('/update-password', userController.updatePassword);
router.post('/update', userController.updateUser);
router.post('/send-otp-mobile', userController.sendOtpToMobile);
// User profile routes
router.post('/createProfile', userController.createProfile);
router.post('/update-profile', userController.updateProfile);
router.get('/getProfile', userController.getProfile);


// Business profile routes
router.post('/create-business-profile', userController.createBusinessProfile);
router.get('/get-business-profile', userController.getBusinessProfile);
router.post('/update-business-profile', userController.updateBusinessProfile);

//CMS API
router.get('/get-all-user', userController.getallUsers);
router.post('/updateMainHeading', cmsController.updateMainHeading);
router.post('/updateSubHeading', cmsController.updateSubHeading);
router.post('/updateButton', cmsController.updateButton);
router.post('/updateNavcard', cmsController.updateNavcard);

router.get('/',(req,res)=>{
    
    res.send("Hello World");
}
)

module.exports = router;
