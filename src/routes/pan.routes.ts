import { Router } from "express";
import verifyToken from "../middlewares/verify-token";
import PanAadhaarController from "../controllers/sandbox/panAadhaar.controller";
import PanController from "../controllers/sandbox/pan.controller";
import queryValidator from "../middlewares/query-validator";

const panRouter = Router();

panRouter.get('/pan-aadhaar-link-status', verifyToken,queryValidator(['pan','aadhaar']), PanAadhaarController.checkLinkStatus);

panRouter.get('/get-pan-details', verifyToken, queryValidator(['pan']), PanController.getAdvancePanDetails);

export default panRouter;