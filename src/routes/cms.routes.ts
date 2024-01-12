import { Router } from "express";
import verifyToken from "../middlewares/verify-token";
import CMSController from "../controllers/cms.controller";
import adminCheck from "../middlewares/admin-check";

const cmsRouter = Router();

cmsRouter.get('/homescreen', CMSController.getHomeScreen);

cmsRouter.get('/total-users', CMSController.getUserCount);

cmsRouter.get('/stats', verifyToken, adminCheck, CMSController.getStats);

cmsRouter.get('/mailing-list', verifyToken, adminCheck, CMSController.getMailingList);

cmsRouter.get('/phone-list', verifyToken, adminCheck, CMSController.getPhoneList);

cmsRouter.post('/main-heading', verifyToken, adminCheck, CMSController.updateMainHeading);

cmsRouter.post('/sub-heading', verifyToken, adminCheck, CMSController.updateSubHeading);

cmsRouter.post('/navcards', verifyToken, adminCheck, CMSController.updateNavCards);

cmsRouter.post('/button', verifyToken, adminCheck, CMSController.updateButton);

export default cmsRouter;
