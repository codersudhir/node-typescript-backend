import { Router } from "express";
import PincodeController from "../controllers/pincode.controller";
import queryValidator from "../middlewares/query-validator";

const pincodeRouter = Router();

pincodeRouter.get('/info-by-pincode', queryValidator(['pincode']), PincodeController.getInfoByPincode);

pincodeRouter.get('/pincode-by-city', queryValidator(['city']), PincodeController.getPincodeByCity);

export default pincodeRouter;