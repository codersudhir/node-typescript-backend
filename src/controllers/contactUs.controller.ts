import { Request, Response } from 'express';
import { prisma } from '../index';
import { ContactUs } from '@prisma/client'

export class ContactUsController {

    static async contactUs(req: Request, res: Response): Promise<void> {
        try {
            const { id: userId } = req.user!;
            const {
                name, email, message, phoneNumber
            } = req.body

             // Validation: Name should only contain characters
        if (!/^[A-Za-z\s]+$/.test(name)) {
            res.status(400).json({ error: 'Invalid name format' });
            return;
        }

        // Validation: Phone number should be numeric and have a maximum length of 10
        if (!/^\d{10}$/.test(phoneNumber)) {
            res.status(400).json({ error: 'Invalid phone number format' });
            return;
        }

        // Validation: Email format
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!existingUser) {
                res.status(404).json({ error: 'User not found' });
                return
            }
            const newContactUs: ContactUs = await prisma.contactUs.create({
                data: {
                    name, email, message, phoneNumber, userId,
                }
            })
            res.status(201).json({ result: newContactUs, message: 'Sucessfull Contact us registerd' });
        } catch (error) {

            res.status(500).json({ success: false, message: 'Internal server error', errors: error });
        }
    }

    static async findAllContactUs(req: Request, res: Response): Promise<void> {
        try {
            const allContactUs = await prisma.contactUs.findMany({});

            res.status(200).json({ success: true, allContactUs });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error', errors: error });
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {

            const { id } = req.params;

            // Get the invoice by ID
            const Contact: ContactUs | null = await prisma.contactUs.findUnique({
                where: { id: parseInt(id) },

            });

            if (!Contact) {
                res.status(404).json({ sucess: false, message: 'Contact us not found' });
                return;
            }

            res.status(200).json(Contact);
        } catch (error) {
            res.status(500).json({ sucess: false, message: 'Internal server error' });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedContactUs = await prisma.contactUs.delete({
                where: { id: parseInt(id) },

            });
            res.status(200).json({ success: true, deletedContactUs, message: "Contact us deleted sucessfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' });
        }




    }

}