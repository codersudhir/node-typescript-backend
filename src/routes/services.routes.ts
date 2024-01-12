import { Router } from 'express';
import ServicesController from '../controllers/services.controller';
import verifyToken from '../middlewares/verify-token';
import adminCheck from '../middlewares/admin-check';

const servicesRouter = Router();

servicesRouter.post('/', verifyToken, adminCheck, ServicesController.createService);
servicesRouter.get('/', ServicesController.getServices);
servicesRouter.get('/:id', ServicesController.getServiceById);
servicesRouter.put('/:id', verifyToken, adminCheck, ServicesController.updateService);
servicesRouter.delete('/:id', verifyToken, adminCheck, ServicesController.deleteService);

export default servicesRouter;