import { Router } from "express";

import LibraryController from "../controllers/library.controller";

const libraryRouter = Router()

// create library
libraryRouter.post('/create',  LibraryController.createLibrary);
 //find all library
 libraryRouter.get('/getAll',  LibraryController.findAllLibrary);
 // find library by id
 libraryRouter.get('/getOne/:id',  LibraryController.findOneLibrary);
//  library update by id
 libraryRouter.put('/update/:id',  LibraryController.updateLibrary);
 // library delete by id
 libraryRouter.delete('/delete/:id',  LibraryController.deleteLibrary);



export default libraryRouter