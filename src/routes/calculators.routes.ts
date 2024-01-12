import { Router } from "express";
import verifyToken from "../middlewares/verify-token";
import CalculatorController from "../controllers/sandbox/calculators.controller";
import bodyValidator from "../middlewares/body-validator";

const calculatorRouter = Router();

calculatorRouter.post('/income-tax/new-regime', verifyToken, bodyValidator, CalculatorController.incomeTaxNewRegime);

calculatorRouter.post('/income-tax/old-regime', verifyToken, bodyValidator, CalculatorController.incomeTaxOldRegime);

calculatorRouter.post('/advance-income-tax/old-regime', verifyToken, bodyValidator, CalculatorController.advanceIncomeTaxOldRegime);

calculatorRouter.post('/advance-income-tax/new-regime', verifyToken, bodyValidator, CalculatorController.advanceIncomeTaxNewRegime);

export default calculatorRouter;