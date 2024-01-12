import { Router } from 'express';
import OrdersController from '../controllers/orders.controller';
import verifyToken from '../middlewares/verify-token';

const ordersRouter = Router();

ordersRouter.post('/', verifyToken, OrdersController.createOrder);
ordersRouter.get('/', verifyToken, OrdersController.getOrders);
ordersRouter.get('/:id', verifyToken, OrdersController.getOrderById);
ordersRouter.put('/:id', verifyToken, OrdersController.updateOrder);
ordersRouter.delete('/:id', verifyToken, OrdersController.deleteOrder);

export default ordersRouter;
