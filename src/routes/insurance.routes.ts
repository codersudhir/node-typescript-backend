import { Router } from "express";
import InsuranceController from "../controllers/insurance.controller";
import verifyToken from "../middlewares/verify-token";
import bodyValidator from "../middlewares/body-validator";

const insourancerouter = Router();

insourancerouter.post(
  "/apply",
  verifyToken,
  bodyValidator,
  InsuranceController.applyForInsurance
);

insourancerouter.get("/getOne/:id",verifyToken, InsuranceController.getInsuranceById);

insourancerouter.get( "/getAll",verifyToken,InsuranceController.getInsuranceApplications);

insourancerouter.get( "/user/:id",verifyToken,InsuranceController.getInsuranceApplicationsByUser);

insourancerouter.delete( "/delete/:id",verifyToken,InsuranceController.deleteInsourance);


export default insourancerouter;
