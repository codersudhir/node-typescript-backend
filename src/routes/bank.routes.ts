import { Router } from "express";
import verifyToken from "../middlewares/verify-token";
import BankController from "../controllers/sandbox/bank.controller";
import bodyValidator from "../middlewares/body-validator";
import queryValidator from "../middlewares/query-validator";

const bankRouter = Router();

bankRouter.get('/details', verifyToken, queryValidator(['ifsc']), BankController.getBankDetailsByIfsc);

bankRouter.post('/verify-account', verifyToken, bodyValidator, BankController.verifyBankAccount);

bankRouter.get('/upi-verify', verifyToken, queryValidator(['virtual_payment_address']), BankController.upiVerification);
export default bankRouter;