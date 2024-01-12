import { Router } from "express";
import { upload } from "../config/file-upload";
import DocumentController from "../controllers/document.controller";
import verifyToken from "../middlewares/verify-token";

const documentRouter = Router();

documentRouter.post('/upload', verifyToken, upload.array('file', 20), DocumentController.uploadDocuments);

documentRouter.get('/document/raw/:id', verifyToken, DocumentController.getRawDocumentById);

export default documentRouter;