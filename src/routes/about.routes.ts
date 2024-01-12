import { Router } from "express";
import { upload } from "../config/file-upload";
import { AboutController } from "../controllers/about.controller";
export const registerAbout = Router()



registerAbout.post('/register', upload.single('image'), AboutController.registerTeam);
registerAbout.get('/getAll', AboutController.findAllTeam);
registerAbout.get('/getOne/:id', AboutController.getTeamById);
registerAbout.delete('/delete/:id', AboutController.delete);
