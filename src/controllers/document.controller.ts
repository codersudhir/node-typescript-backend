import { Request, Response } from "express";
import { prisma } from "..";
import { z } from "zod";
import { DocumentType } from "@prisma/client";
import { join } from "path";
import { cwd } from "process";

const AttachDocumentBodySchema = z.object({
    documents: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            shortName: z.string(),
            mandatory: z.boolean().default(false),
            type: z.nativeEnum(DocumentType),
            description: z.string().optional(),
        }),
    ),
    applicationId: z.string(),
});

const currentDir = cwd();

export default class DocumentController {

    static async uploadDocuments(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const files = req.files as Express.Multer.File[];

            if (!files) {
                return res.status(400).json({ success: false, message: 'No files to upload.' });
            }

            const documents = await prisma.$transaction(
                files.map(file => {
                    const fileName = file.path.split('/').pop()!;

                    return prisma.uploadedDocument.create({
                        data: {
                            userId,
                            fileName,
                            
                        }
                    })
                })
            );

            return res.status(200).json({ success: true, message: `${files.length} Documents uploaded`, documents });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async attachDocuments(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const { documents, applicationId } = AttachDocumentBodySchema.parse(req.body);

            if (!documents.length || !applicationId) {
                return res.status(400).json({ success: false, message: 'Document IDs and Application ID are required' });
            }

            const application = await prisma.loanApplication.findUnique({
                where: {
                    id: applicationId
                }
            });

            if (!application || application.userId !== userId) {
                return res.status(200).json({ success: false, message: 'Application not found.' });
            }

            await prisma.loanDocument.createMany({
                data: documents,
            });

            const attachedDocuments = await prisma.$transaction(
                documents.map(cur =>
                    prisma.uploadedDocument.update({
                        where: { id: cur.id },
                        data: {
                            applicationId
                        }
                    })
                )
            );

            return res.status(200).json({ success: true, message: 'Documents attached', attachedDocuments, });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async deleteDocument(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const { documentId } = req.body;

            if (!documentId) {
                return res.status(400).json({ success: false, message: 'Document ID is required' });
            }

            const doc = await prisma.uploadedDocument.findUnique({
                where: {
                    id: documentId
                }
            });

            if (!doc || doc.userId !== userId) {
                return res.status(200).json({ success: false, message: 'Document not found.' });
            }

            await prisma.uploadedDocument.delete({
                where: {
                    id: documentId,
                },
            });

            if (doc.applicationId) {
                await prisma.loanApplication.delete({
                    where: {
                        id: doc.applicationId,
                    },
                });
            }

            return res.status(200).json({ success: true, message: 'Document deleted', });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async getDocumentsByApplication(req: Request, res: Response) {
        try {
            const { applicationId } = req.body;

            if (!applicationId) {
                return res.status(400).json({ success: false, message: 'Application ID is required' });
            }

            const { id: userId } = req.user!;

            const isAdmin = req.isAdmin;

            if (isAdmin) {
                const documents = await prisma.uploadedDocument.findMany({
                    where: { applicationId },
                    include: {
                        docs: true,
                    },
                });

                return res.status(200).json({ success: true, documents });
            } else {
                const documents = await prisma.uploadedDocument.findMany({
                    where: { applicationId, userId },
                    include: {
                        docs: true,
                    },
                });

                return res.status(200).json({ success: true, documents });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async getRawDocumentById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Document ID is required' });
            }

            const { id: userId } = req.user!;

            const doc = await prisma.uploadedDocument.findFirst({
                where: {
                    id,
                    userId,
                }
            });

            if (!doc) {
                return res.status(404).json({ success: false, message: 'Document not found' });
            }

            return res.sendFile(join(currentDir, 'uploads', doc.fileName));
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

}