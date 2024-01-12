import { Request, Response } from "express";
import { ZodError, z } from "zod";
import { PHONE_NUMBER_RGX } from "../lib/util";
import { UserGender } from "@prisma/client";
import { prisma } from "..";

const InsuranceSchema = z.object({
    name: z.string(),
    address: z.string(),
    email:z.string(),
    mobile: z.string().regex(PHONE_NUMBER_RGX, 'Enter valid 10 digit mobile number'),
    maritalStatus: z.string(),
    gender: z.nativeEnum(UserGender),
    type: z.string(),
    dob: z.coerce.date(),
    
});

export default class InsuranceController {

    static async applyForInsurance(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const { name, address, mobile, dob, gender, maritalStatus, type ,email} = InsuranceSchema.parse(req.body);

            const application = await prisma.insurance.create({
                data: {
                    name,
                    address,
                    mobile,
                    dob,
                    gender,
                    maritalStatus,
                    type,
                    email,
                    userId,
                }
            });

            return res.status(201).json({ success: true, message: 'Successfully applied for insurance', application });
        } catch(e) {
            console.log(e);
            if (e instanceof ZodError) {
                return res.status(400).json({ success: false, message: e.message });
            }
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async getInsuranceById(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const { id } = req.params;

             const insurance = await prisma.insurance.findUnique({ where: { id } });

            if(insurance && (insurance.userId != userId || !req.isAdmin)) {
                return res.status(403).json({ success: false, message: 'Unauthorized Access' });
            }

            return res.status(200).json({ success: true, application: insurance });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async getInsuranceApplications(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const { order }: { order?: string } = req.query;

            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;

            const count = await prisma.insurance.count({
                where: { userId }
            });

            const applications = await prisma.insurance.findMany({
                where: { userId },
                orderBy: {
                    createdAt: order === 'asc' ? 'asc' : 'desc',
                },
                take: parsedLimit,
                skip: offset
            });

            return res.status(200).json({ success: true, applications, totalApplications: count });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async getInsuranceApplicationsByUser(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const userId = parseInt(id);

            const { order }: { order?: string } = req.query;

            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;

            const count = await prisma.insurance.count({
                where: { userId }
            });

            const applications = await prisma.insurance.findMany({
                where: { userId },
                orderBy: {
                    createdAt: order === 'asc' ? 'asc' : 'desc',
                },
                take: parsedLimit,
                skip: offset
            });

            return res.status(200).json({ success: true, applications, totalApplications: count });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async deleteInsourance(req: Request, res: Response): Promise<void> {
        try {
           
            const { id } = req.params;
            const deleted = await prisma.insurance.delete({
                where: { id: (id) },

            });
            res.status(200).json({ success: true, deleted, message: "Insourance  delete sucessfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' });
        }




    }



}