import { Router } from 'express';
import PaymentsController from '../controllers/payments.controller';
import verifyToken from '../middlewares/verify-token';

const paymentsRouter = Router();

paymentsRouter.post('/', verifyToken, PaymentsController.createPayment);
paymentsRouter.get('/', verifyToken, PaymentsController.getPayments);
paymentsRouter.get('/:id', verifyToken, PaymentsController.getPaymentById);
paymentsRouter.put('/:id', verifyToken, PaymentsController.updatePayment);
paymentsRouter.delete('/:id', verifyToken, PaymentsController.deletePayment);

export default paymentsRouter;
