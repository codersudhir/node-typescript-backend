import { Request, Response } from 'express';
import { prisma } from '../index';
import TokenService from '../services/token.service';

export default class PaymentsController {
    public static async createPayment(req: Request, res: Response): Promise<Response> {
        try {
            const { razorpay_order_id, razorpay_payment_id, status, orderId } = req.body;

            // Verify user login
            const token = TokenService.getTokenFromAuthHeader(req.headers.authorization);

            const { id: userId } = TokenService.decodeToken(token!);

            // Check if the user exists
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(401).json({ sucess: false, message: 'User not found' });
            }

            const payment = await prisma.payment.create({
                data: {
                    razorpay_order_id,
                    razorpay_payment_id,
                    status,
                    userId,
                    orderId,
                },
            });
            return res.json({ success: true, message: 'Payment created successfully', data: payment });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to create payment' });
        }
    }

    public static async getPayments(req: Request, res: Response): Promise<Response> {
        try {
            // Verify user login
            const token = TokenService.getTokenFromAuthHeader(req.headers.authorization);

            const { id: userId } = TokenService.decodeToken(token!);

            const payments = await prisma.payment.findMany({ where: { userId } });
            return res.json({ success: true, message: 'Payments fetched successfully', data: payments });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch payments' });
        }
    }

    public static async getPaymentById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        // Verify user login
        const token = TokenService.getTokenFromAuthHeader(req.headers.authorization);

        const { id: userId } = TokenService.decodeToken(token!);

        try {
            const payment = await prisma.payment.findFirst({ where: { id, userId } });
            if (payment) {
                return res.json({ success: true, message: 'Payment fetched successfully', data: payment });
            } else {
                return res.status(404).json({ success: false, message: 'Payment not found' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch payment' });
        }
    }

    public static async updatePayment(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const { razorpay_order_id, razorpay_payment_id, status, orderId } = req.body;
        
        try {
            // Verify user login
            const token = TokenService.getTokenFromAuthHeader(req.headers.authorization);

            const { id: userId } = TokenService.decodeToken(token!);

            const payment = await prisma.payment.findUnique({ where: { id } });

            if(payment?.userId !== userId) {
                return res.status(403).send({ success: false, message: 'Unauthorized Access' });
            }

            const updatedPayment = await prisma.payment.update({
                where: { id },
                data: {
                    razorpay_order_id,
                    razorpay_payment_id,
                    status,
                    userId,
                    orderId,
                },
            });
            return res.json({ success: true, message: 'Payment updated successfully', data: updatedPayment });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to update payment' });
        }
    }

    public static async deletePayment(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            // Verify user login
            const token = TokenService.getTokenFromAuthHeader(req.headers.authorization);

            const { id: userId } = TokenService.decodeToken(token!);

            const payment = await prisma.payment.findUnique({ where: { id } });

            if(payment?.userId !== userId) {
                return res.status(403).send({ success: false, message: 'Unauthorized Access' });
            }

            await prisma.payment.delete({ where: { id } });
            return res.json({ success: true, message: 'Payment deleted successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to delete payment' });
        }
    }
}