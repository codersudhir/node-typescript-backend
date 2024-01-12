import { Request, Response } from "express";

import cards from '../config/cards.json';
import { writeFile } from "fs/promises";
import { prisma } from "..";
import { join } from "path";

export default class CMSController {

    static cardFilePath = join(__dirname, '..', 'config/cards.json')

    static async updateCards(cards: object) {
        await writeFile(CMSController.cardFilePath, JSON.stringify(cards));
    }

    static getHomeScreen(req: Request, res: Response) {
        try {
            return res.status(200).json({
                success: true,
                data: cards
            });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

    static async updateMainHeading(req: Request, res: Response) {
        try {
            const { mainHeading } = req.body;

            cards.home.upper.mainHeading = mainHeading;

            await CMSController.updateCards(cards);

            return res.status(200).json({ 
                success: true, 
                message: 'Main Heading Updated', 
                data: cards.home 
            });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

    static async updateSubHeading(req: Request, res: Response) {
        try {
            const { subHeading } = req.body;

            cards.home.upper.subHeading = subHeading;

            await CMSController.updateCards(cards);

            return res.status(200).json({ 
                success: true, 
                message: 'Sub Heading Updated', 
                data: cards.home 
            });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

    static async updateButton(req: Request, res: Response) {
        try {
            const { button } = req.body;

            cards.home.upper.button = button;

            await CMSController.updateCards(cards);

            return res.status(200).json({ 
                success: true, 
                message: 'Button Updated', 
                data: cards.home 
            });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

    static async updateNavCards(req: Request, res: Response) {
        try {
            const { navcards } = req.body;

            cards.home.navcards = navcards;

            await CMSController.updateCards(cards);

            return res.status(200).json({ 
                success: true, 
                message: 'Navcards Updated', 
                data: cards.home 
            });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getUserCount(req: Request, res: Response) {
        try {
            const count = await prisma.user.count();

            return res.status(200).json({ success: true, count });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getStats(_req: Request, res: Response) {
        try {
            const totalUsers = await prisma.user.count();
            const totalEmails = await prisma.user.count({ where: { email: { not: undefined } } });
            const totalPhoneNumbers = await prisma.user.count({ where: { phone: { not: null } } });

            return res.status(200).json({ 
                success: true, 
                data: {
                    totalUsers,
                    totalEmails,
                    totalPhoneNumbers,
                },
            });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getMailingList(req: Request, res: Response) {
        try {
            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;

            const mailingList = await prisma.user.findMany({
                where: {
                    email: {
                        not: undefined
                    }
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    userType: true,
                    email: true,
                },
                skip: offset,
                take: parsedLimit,
            })

            return res.status(200).json({ success: true, mailingList });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getPhoneList(req: Request, res: Response) {
        try {
            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;

            const phoneList = await prisma.user.findMany({
                where: {
                    phone: {
                        not: null
                    }
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    userType: true,
                    phone: true,
                },
                skip: offset,
                take: parsedLimit,
            })

            return res.status(200).json({ success: true, phoneList });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

}
