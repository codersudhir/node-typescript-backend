import { Router } from "express";
import PostOfficeController from "../controllers/postOffice.controller";
import queryValidator from "../middlewares/query-validator";

const postOfficeRouter = Router();

postOfficeRouter.get('/by-pincode', queryValidator(['pincode']), PostOfficeController.getPostOfficeByPincode);

export default postOfficeRouter;