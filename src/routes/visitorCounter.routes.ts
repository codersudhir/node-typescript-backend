import { Router } from "express";
import { VisitorCounterController } from "../controllers/VisitorCounter.Controller";


const visitorRouter = Router()

visitorRouter.post('/create', VisitorCounterController.create);
visitorRouter.get('/getAll', VisitorCounterController.getAll);

export default visitorRouter