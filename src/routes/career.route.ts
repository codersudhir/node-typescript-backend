import { Router } from 'express';
import CareerController from '../controllers/career.controller';
import { upload } from '../config/file-upload';
import verifyToken from '../middlewares/verify-token';
const careerRouter = Router();
//create career
careerRouter.post('/create', upload.single('cv'),  CareerController.createCareer);
//find all career
careerRouter.get('/findAll',  CareerController.findAllCareer);
// find library by id
careerRouter.get('/findOne/:id',  CareerController.findOneCareer);
// delete career
careerRouter.delete('/delete/:id',  CareerController.deleteCareer);

careerRouter.get('/getCv/:id',  CareerController.getCVByCareerId);
export default careerRouter