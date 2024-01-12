import { Router } from "express";
import verifyToken from "../middlewares/verify-token";
import BusinessProfileController from "../controllers/businessProfile.controller";
import adminCheck from "../middlewares/admin-check";

const businessProfileRouter = Router();

businessProfileRouter.post('/', verifyToken, BusinessProfileController.update);

businessProfileRouter.get('/profile', verifyToken, BusinessProfileController.getProfile);

businessProfileRouter.get('/profile/all', verifyToken, adminCheck, BusinessProfileController.getAllProfiles);

businessProfileRouter.get('/profile/:id', verifyToken, adminCheck, BusinessProfileController.getProfileById);

export default businessProfileRouter;