import { Request, Response } from 'express';
import { Library, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// create library

class LibraryController {
  static async createLibrary(req: Request, res: Response): Promise<void> {
    try {
      const {
        pan, section, sub_section, subject, ao_order, itat_no, rsa_no
        , bench, appeal_no, appellant, respondent, appeal_type, appeal_filed_by,
        order_result, tribunal_order_date, assessment_year, judgment, conclusion, download, upload
      } = req.body;

      const Library = await prisma.library.create({
        data: {
          pan, section, sub_section, subject, ao_order, itat_no, rsa_no
          , bench, appeal_no, appellant, respondent, appeal_type, appeal_filed_by,
          order_result, tribunal_order_date, assessment_year, judgment, conclusion, download, upload

        },
      });

      res.status(201).json({ message: 'Library added successfully', result: Library });
    } catch (error) {
      //console.log(error)
      res.status(500).json({ success: false, message: 'Internal server error', errors: error });
    }
  }

  // find All library
  static async findAllLibrary(req: Request, res: Response): Promise<void> {
    try {
      const allLibrary = await prisma.library.findMany({});
      
      res.status(200).json({ success: true, allLibrary });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error', errors: error });
    }
  }

  //get library by id

  static async findOneLibrary(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      const library: Library | null = await prisma.library.findUnique({
        where: {
          id,
        },
      });

      if (!library) {
        res.status(404).json({ success: false, message: 'library not found' });
        return;
      }

      res.status(200).json(library);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  //profile update by id
  static async updateLibrary(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const {
        pan, section, sub_section, subject, ao_order, itat_no, rsa_no
        , bench, appeal_no, appellant, respondent, appeal_type, appeal_filed_by,
        order_result, tribunal_order_date, assessment_year, judgment, conclusion, download, upload
      } = req.body;
      const updatedLibrary: Library | null = await prisma.library.update({
        where: { id: id },
        data: {
          pan, section, sub_section, subject, ao_order, itat_no, rsa_no
          , bench, appeal_no, appellant, respondent, appeal_type, appeal_filed_by,
          order_result, tribunal_order_date, assessment_year, judgment, conclusion, download, upload
        }
      })
      if (!updatedLibrary) {
        res.status(404).json({ sucess: false, message: 'library not found' });
        return;
      }

      res.status(200).json({ sucess: true, updatedLibrary });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }

  }

  //delete library by id
  static async deleteLibrary(req: Request, res: Response): Promise<void> {
    try {
      const Id = parseInt(req.params.id);

      // Delete the profile
      const deletedLibrary: Library | null = await prisma.library.delete({ where: { id: Id } });

      if (!deletedLibrary) {
        res.status(404).json({ success: false, message: 'library not found' });
        return;
      }

      res.status(200).json({ success: true, deletedLibrary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}



export default LibraryController