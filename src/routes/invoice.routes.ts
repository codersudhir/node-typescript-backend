import { Router } from 'express';
import InvoiceController from '../controllers/invoice.controller';
import verifyToken from '../middlewares/verify-token';

const invoiceRouter = Router();

invoiceRouter.get('/summary', verifyToken, InvoiceController.summary);

// Routes for invoices
invoiceRouter.get('/invoices/:id', verifyToken, InvoiceController.getById);
invoiceRouter.get('/invoices', verifyToken, InvoiceController.getAll);
invoiceRouter.post('/invoices', verifyToken, InvoiceController.create);
invoiceRouter.put('/invoices/:id', verifyToken, InvoiceController.update);
invoiceRouter.delete('/invoices/:id', verifyToken, InvoiceController.delete);

// Routes for parties
invoiceRouter.get('/parties', verifyToken, InvoiceController.getAllParties);
invoiceRouter.get('/parties/:id', verifyToken, InvoiceController.getPartyById);
invoiceRouter.post('/parties', verifyToken, InvoiceController.createParty);
invoiceRouter.delete('/parties/:id', verifyToken, InvoiceController.deleteParty);

// Routes for items
invoiceRouter.get('/items', verifyToken, InvoiceController.getAllItems);
invoiceRouter.get('/items/:id', verifyToken, InvoiceController.getItemById);
invoiceRouter.post('/items', verifyToken, InvoiceController.createItem);
invoiceRouter.put('/items/:id', verifyToken, InvoiceController.updateItem);
invoiceRouter.delete('/items/:id', verifyToken, InvoiceController.deleteItem);

export default invoiceRouter;

