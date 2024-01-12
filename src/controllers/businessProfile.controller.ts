import { Request, Response } from "express";
import { prisma } from "..";
import TokenService from "../services/token.service";
import { UserType } from "@prisma/client";

export default class BusinessProfileController {

    static async getProfile(req: Request, res: Response) {
        try {
           
            const  id  = req.user?.id;

            const profile = await prisma.businessProfile.findFirst({ where: {userId: id } });

            // if (!profile) {
            //     return await BusinessProfileController.update(req, res);
            // }

            return res.status(200).send({ success: true, data: { profile } });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong' });
        }
    }

    static async getProfileById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const profile = await prisma.businessProfile.findFirst({ where: { id: parseInt(id) } });

            if (!profile) {
                return res.status(404).send({ success: false, message: 'Business Profile does not exists.' });
            }

            return res.status(200).send({ success: true, data: { profile } });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong' });
        }
    }

    static async getAllProfiles(req: Request, res: Response) {
        try {
            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;


            const profiles = await prisma.businessProfile.findMany({
                skip: offset,
                take: parsedLimit,
            });

            return res.status(200).send({ success: true, data: { profiles } });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.user!;

            const data = req.body;

            if (!data) {
                return res.status(400).send({ success: false, message: 'Business Profile data cannot be empty' });
            }

            if (!data.businessName) {
                return res.status(400).send({ success: false, message: 'Business Name cannot be empty' });
            }
            
            const user = await prisma.user.findFirst({ where: { id } });

            if (!user) {
                return res.status(404).send({ success: false, message: 'User does not exists' });
            }

            const found = await prisma.businessProfile.findFirst({
                where: {
                    userId:id
                },
            });

            let profile;

            if (!found) {
                data['id'] = undefined;
                profile = await prisma.businessProfile.create({ data: { ...data, userId: id } });
            } else {
                const { id: _id, ...rest } = data;
                console.log(rest);
                profile = await prisma.businessProfile.update({
                    where: {
                        id: found.id,
                    },
                    data: {
                        ...rest,
                        userId: id,
                    }
                });
            }

            return res.status(200).send({ success: true, message: "Profile Updated", profile });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong' });
        }
    }

}
