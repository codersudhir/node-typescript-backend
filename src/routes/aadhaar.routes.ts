import { Router } from "express";
import verifyToken from "../middlewares/verify-token";
import queryValidator from "../middlewares/query-validator";
import AadhaarController from "../controllers/sandbox/aadhaar.controller";
import bodyValidator from "../middlewares/body-validator";

const aadhaarRouter = Router();

aadhaarRouter.get('/verify', verifyToken, queryValidator(['aadhaar_number']), AadhaarController.verifyAadhaar);

aadhaarRouter.post('/aadhaar-generate-otp',verifyToken,bodyValidator,AadhaarController.aadharGenerateOtp)

aadhaarRouter.post('/aadhaar-verify-otp',verifyToken,bodyValidator,AadhaarController.aadhaarVerifyOtp)
export default aadhaarRouter;