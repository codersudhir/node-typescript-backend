import { Router } from "express";
import verifyToken from "../middlewares/verify-token";
import { RegisterStartupController } from "../controllers/registerStartup.controller";
import { upload } from "../config/file-upload";
 const registerStartupRouter = Router()



registerStartupRouter.post('/register',upload.single('image'), verifyToken, RegisterStartupController.RegisterStartup);
registerStartupRouter.get('/getAll', verifyToken, RegisterStartupController.findAllStartup);
registerStartupRouter.get('/getOne/:id', verifyToken, RegisterStartupController.getById);
registerStartupRouter.delete('/delete/:id', verifyToken, RegisterStartupController.delete);

export default registerStartupRouter