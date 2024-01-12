import { Request, Response } from 'express';
import { prisma } from '../index';
import { About } from '@prisma/client'
export class AboutController {

    static async registerTeam(req: Request, res: Response) {
        try {
            const image: string = req.file?.path as string
            const { name, position, description } = req.body


            if (!name) {
                return res.status(400).json({ success: false, message: 'Required Query  name was not provided' });

            }
            if (!image) {
                return res.status(400).json({ success: false, message: 'Required Query image was not provided' });

            }
            if (!position) {
                return res.status(400).json({ success: false, message: 'Required Query categories was not provided' });

            }


            const AboutUs: About = await prisma.about.create({
                data: {
                    name, image, position, description
                }
            })
            return res.status(201).json({ result: AboutUs, message: 'Sucessfull Register ' });
        } catch (error) {

            return res.status(500).json({ success: false, message: 'Internal server error', errors: error });
        }
    }

    static async findAllTeam(req: Request, res: Response) {
        try {
            const AllTeam = await prisma.about.findMany({});

            return res.status(200).json({ success: true, AllTeam });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error', errors: error });
        }
    }

    static async getTeamById(req: Request, res: Response) {
        try {

            const { id } = req.params;

            // Get the invoice by ID
            const Team: About | null = await prisma.about.findUnique({
                where: { id: (id) },

            });

            if (!Team) {
                return res.status(404).json({ sucess: false, message: 'Team not found' });

            }

            return res.status(200).json(Team);
        } catch (error) {
            return res.status(500).json({ sucess: false, message: 'Internal server error' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedTeam = await prisma.about.delete({
                where: { id: (id) },

            });
            return res.status(200).json({ success: true, deletedTeam, message: " itaxeasy team member deleted sucessfully" });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }




    }

}