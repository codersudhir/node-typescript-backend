import { Router } from "express";
import MCAController from "../controllers/sandbox/mca.controller";
import verifyToken from "../middlewares/verify-token";
import queryValidator from "../middlewares/query-validator";

const mcaRouter = Router();

mcaRouter.get('/company-details', verifyToken, MCAController.getCompanyByCIN);
mcaRouter.get('/director-details', verifyToken,queryValidator(['din']), MCAController.getDirectorByDIN);
export default mcaRouter;