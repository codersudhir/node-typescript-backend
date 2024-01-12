import { Request, Response } from 'express';
import { Career } from '@prisma/client'
import { join } from "path";
import { cwd } from "process";
import { prisma } from "..";



const currentDir = cwd();


export default class CareerController {
    //create career
    static async createCareer(req: Request, res: Response){
        try {
           
            const file = req.file as Express.Multer.File; // Assuming a single CV file

            if (!file) {
                return res.status(400).json({ success: false, message: 'No CV file to upload.' });
            }

            const {
                name,
                address,
                pin,
                email,
                mobile,
                skills,
                gender,
            } = req.body;

            if (!name || !address || !pin || !email || !mobile || !skills || !gender) {
                return res.status(400).json({ success: false, message: 'Missing required fields.' });
            }

            const cvFileName = file.filename;

            const career = await prisma.career.create({
                data: {
                    cv: cvFileName, // Assuming 'cv' field corresponds to the 'fileName'
                    name,
                    address,
                    pin,
                    email,
                    mobile,
                    skills,
                    gender,
                },
            });

            return res.status(200).json({ success: true, message: 'Career created', career });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }
    //getAll career
    static async findAllCareer(req: Request, res: Response): Promise<void> {
        try {
            const allCareer = await prisma.career.findMany({});

            res.status(200).json({ success: true, allCareer });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error', errors: error });
        }
    }
    //find one career
    static async findOneCareer(req: Request, res: Response): Promise<void> {
        try {
           
            const id = parseInt(req.params.id);

            const Career: Career | null = await prisma.career.findUnique({
              where: {
                id,
              },
            })

            if (!Career) {
                res.status(404).json({ success: false, message: 'career not found' });
                return;
            }

            res.status(200).json(Career);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    //delete career by id
    static async deleteCareer(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            // const { id: careerId } = req.user!
            // Delete the career
            const deletedCareer: Career | null = await prisma.career.delete({ where: { id } });

            if (!deletedCareer) {
                res.status(404).json({ success: false, message: 'career not found' });
                return;
            }

            res.status(200).json({ success: true, deletedCareer });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getCVByCareerId(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Career ID is required' });
            }

         

            const career = await prisma.career.findFirst({
                where: {
                    id:parseInt(id),
                  
                },
                select: {
                    cv: true,
                },
            });

            if (!career || !career.cv) {
                return res.status(404).json({ success: false, message: 'CV not found for the provided career ID' });
            }

            const cvFileName = career.cv;

            return res.sendFile(join(currentDir, 'uploads', cvFileName));
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }
}

