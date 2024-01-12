import { Router } from "express";
import PaymentController from "../controllers/payment/payment.controller";
import verifyToken from "../middlewares/verify-token";

const paymentRouter = Router();

paymentRouter.post('/initiate_payment', verifyToken, PaymentController.initiatePayment);
paymentRouter.post('/transaction', verifyToken, PaymentController.transaction);
paymentRouter.post('/transaction_date', verifyToken, PaymentController.transactionDate);
paymentRouter.post('/payout', verifyToken, PaymentController.payout);
paymentRouter.post('/refund', verifyToken, PaymentController.refund);
paymentRouter.post('/response', verifyToken, PaymentController.response);

export default paymentRouter;
