import { Router } from "express";


import verifyToken from "../middlewares/verify-token";
import { ContactUsController } from "../controllers/contactUs.controller";

const contactUsRouter = Router()

contactUsRouter.post('/create', verifyToken, ContactUsController.contactUs);
contactUsRouter.get('/getAll', verifyToken, ContactUsController.findAllContactUs);
contactUsRouter.get('/getOne/:id', verifyToken, ContactUsController.getById);
contactUsRouter.delete('/delete/:id', verifyToken, ContactUsController.delete);

export default contactUsRouter