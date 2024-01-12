import { Request, Response } from 'express';
import { prisma } from '../index';

export default class ServicesController {
    public static async createService(req: Request, res: Response): Promise<Response> {
        try {
            const { serviceName, serviceType, imgUrl, description, price, gst, documents } = req.body;
            const service = await prisma.service.create({
                data: {
                    serviceName,
                    serviceType,
                    imgUrl,
                    description,
                    price,
                    gst,
                    documents,
                },
            });
            return res.json({ success: true, message: 'Service created successfully', data: service });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to create service' });
        }
    }

    public static async getServices(_: Request, res: Response): Promise<Response> {
        try {
            const services = await prisma.service.findMany();
            return res.json({ success: true, message: 'Services fetched successfully', data: services });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch services' });
        }
    }

    public static async getServiceById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const service = await prisma.service.findUnique({ where: { id } });
            if (service) {
                return res.json({ success: true, message: 'Service fetched successfully', data: service });
            } else {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch service' });
        }
    }

    public static async updateService(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { serviceName, serviceType, imgUrl, description, price, gst, documents } = req.body;
        try {
            const updatedService = await prisma.service.update({
                where: { id },
                data: {
                    serviceName,
                    serviceType,
                    imgUrl,
                    description,
                    price,
                    gst,
                    documents,
                },
            });
            return res.json({ success: true, message: 'Service updated successfully', data: updatedService });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to update service' });
        }
    }

    public static async deleteService(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            await prisma.service.delete({ where: { id } });
            return res.json({ success: true, message: 'Service deleted successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to delete service' });
        }
    }
}