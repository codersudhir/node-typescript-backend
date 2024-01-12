import { Request, Response } from 'express';
import { prisma } from '../index';
import { OrderStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import PaymentService from './payment/payment.service';

const calculateGST = (price: Decimal, gstPercentage: Decimal): Decimal => {
    const gstMultiplier = gstPercentage.div(new Decimal(100));
  
    const gstAmount = price.mul(gstMultiplier);
  
    const totalPrice = price.add(gstAmount);
  
    return totalPrice;
  };

export default class OrdersController {
    public static async createOrder(req: Request, res: Response): Promise<Response> {
        try {
            const { services, stateOfSupply } = req.body;

            const { id: userId } = req.user!;

            const serviceRecords = await prisma.service.findMany({
                where: {
                    id: {
                        in: services
                    }
                }
            });

            if(serviceRecords.some(x => !x)) {
                return res.status(404).json({ success: false, message: "Invalid service ID"});
            }

            const totalPrice = serviceRecords.reduce((totalPrice, service) => totalPrice.add(service.price), new Decimal(0.0));

            const totalGst = serviceRecords.reduce((totalGst, service) => totalGst.add(service.gst), new Decimal(0.0));

            const orderTotal = calculateGST(totalPrice, totalGst);

            const order = await prisma.order.create({
                data: {
                    services,
                    status: OrderStatus.initiated,
                    price: totalPrice,
                    userId,
                    gst: totalGst,
                    orderTotal,
                    stateOfSupply,
                },
            });

            return res.json({ success: true, message: 'Order created successfully', data: order });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Failed to create order' });
        }
    }

    public static async getOrders(req: Request, res: Response): Promise<Response> {
        try {
            const { id: userId } = req.user!;
            
            const orders = await prisma.order.findMany({ where: { userId } });
            return res.json({ success: true, message: 'Orders fetched successfully', data: orders });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
        }
    }

    public static async getOrderById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const { id: userId } = req.user!;

            const order = await prisma.order.findFirst({ where: { id: parseInt(id), userId } });
            if (order) {
                return res.json({ success: true, message: 'Order fetched successfully', data: order });
            } else {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch order' });
        }
    }

    public static async updateOrder(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const { id: userId, email, phone } = req.user!;

            const order = await prisma.order.findFirst({ where: { id: parseInt(id), userId } });

            if(!order) {
                return res.status(404).send({ success: false, message: 'Order does not exists.' });
            }

            const { data: { status }} = await PaymentService.transaction({
                email,
                phone: phone!,
                txnid: String(order.id),
                amount: order.orderTotal.toString(),
            });

            const updatedOrder = await prisma.order.update({
                where: { id: parseInt(id) },
                data: {
                    status
                },
            });
            return res.json({ success: true, message: 'Order updated successfully', data: updatedOrder });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to update order' });
        }
    }

    public static async deleteOrder(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const { id: userId } = req.user!;

            const order = await prisma.order.findFirst({ where: { id: parseInt(id), userId } });

            if(!order) {
                return res.status(404).send({ success: false, message: 'Order does not exists.' });
            }

            await prisma.order.delete({ where: { id: parseInt(id) } });
            return res.json({ success: true, message: 'Order deleted successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to delete order' });
        }
    }
}
