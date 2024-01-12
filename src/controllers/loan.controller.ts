import { BankAccountType, DocumentType, Loan, LoanApplication, LoanStatus, LoanType, Nationality, UserGender } from "@prisma/client";
import { Request, Response } from "express";

import z, { ZodError } from 'zod'
import { PHONE_NUMBER_RGX } from "../lib/util";
import { prisma } from "..";

const LoanApplicationSchema = z.object({
    loanId: z.string({ required_error: "Loan Id is required" }),
    amount: z.number({ required_error: "Loan Amount is required" }),
    loanType: z.nativeEnum(LoanType),
    description: z.string(),
    documents: z.array(z.string()),
    agentId: z.string().optional(),
    applicantDetails: z.object({
        applicantName: z.string().min(3),
        applicantAge: z.number().min(18, "Applicant must be atleast 18 years old to apply for loan"),
        applicantGender: z.nativeEnum(UserGender, { required_error: "Please confirm your gender" }),
        nationality: z.nativeEnum(Nationality, { required_error: "Please confirm your nationality" }),
        salaried: z.boolean({ required_error: "Please select whether you are salaried or not" }),
        phone: z.string().regex(PHONE_NUMBER_RGX, "Please Enter a valid 10 digit phone number"),
        email: z.string().email("Please enter a valid Email"),
        permanentAddress: z.string(),
        address: z.string().optional(),
        bankDetails: z.object({
            accountHolderName: z.string().min(3),
            bankName: z.string(),
            bankAccountNo: z.string(),
            bankAccountType: z.nativeEnum(BankAccountType),
            bankIfsc: z.string(),
            bankBranch: z.string(),
        }),
    }),
});

const LoanSchema = z.object({
    type: z.nativeEnum(LoanType),
    name: z.string(),
    shortName: z.string().optional(),
    description: z.string().optional(),
    documents: z.array(z.object({
        id: z.string().optional(),
        name: z.string(),
        shortName: z.string(),
        mandatory: z.boolean(),
        type: z.nativeEnum(DocumentType),
        description: z.string().optional(),
    })),
    maxAmount: z.number().optional(),
    minAmount: z.number().optional(),
    interest: z.number()
});

export default class LoanController {

    static async applyForLoan(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const data = LoanApplicationSchema.parse(req.body);

            const { loanId, documents, amount, description ,loanType} = data;

            const { applicantName, applicantAge, applicantGender, nationality, salaried, bankDetails: bankDetailsData, permanentAddress, address, phone,email} = data.applicantDetails;

            const bankDetails = await prisma.bankDetails.create({
                data: {
                    ...bankDetailsData,
                    userId,
                },
                
            });

            const application = await prisma.loanApplication.create({
                data: {
                    loanId,
                    userId,
                    applicantName,
                    applicantAge,
                    applicantGender,
                    address,
                    loanType,
                    phone,
                    email,
                    permanentAddress,
                    nationality,
                    salaried,
                    loanAmount: amount,
                    description,
                    bankAccountId: bankDetails.id,
                    documents: {
                        connect: documents.map(id => ({ id })),
                    },
                },
                include: {
                    documents: true,
                }
            });

            return res.status(201).json({
                success: true,
                data: {
                    application,
                    bankDetails,
                }
            });
        } catch (e) {
            console.log(e);
            if (e instanceof ZodError) {
                return res.status(400).json({ success: false, message: e.message });
            }

            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async getAppliedLoans(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const { status, order }: { status?: LoanStatus, order?: string } = req.query;

            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;

            const count = await prisma.loanApplication.count({
                where: { userId },
                orderBy: {
                    createdAt: order === 'asc' ? 'asc' : 'desc',
                }
            });

            // Get all loan applications of the user with pagination
            const applications: LoanApplication[] = await prisma.loanApplication.findMany({
                where: {
                    userId,
                    loanStatus: status
                },
                skip: offset,
                take: parsedLimit,
            });

            return res.status(200).json({
                success: true,
                data: {
                    totalApplications: count,
                    applications,
                    page,
                },
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getAppliedLoanById(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;
            const { id } = req.params;

            const application = await prisma.loanApplication.findFirst({
                where: {
                    id,
                    userId,
                },
                include: {
                    bankDetails: true,
                    documents: true,
                }
            });

            if (!application) {
                return res.status(404).json({ success: false, message: "Loan Application not found" });
            }

            return res.status(200).json({
                success: true,
                data: {
                    application
                }
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong.' });
        }
    }

    // FOR ADMIN

    static async createLoan(req: Request, res: Response) {
        try {
            const { name, shortName, type, description, minAmount, maxAmount, documents, interest } = LoanSchema.parse(req.body);

            const loan = await prisma.loan.create({
                data: {
                    name,
                    shortName,
                    type,
                    minAmount,
                    maxAmount,
                    interest,
                    description,
                    documents: {
                        connectOrCreate: documents.map(document => ({
                            where: { id: document.id },
                            create: document,
                        })),
                    }
                },
            });

            return res.status(201).json({ success: true, message: 'Loan Created', data: { loan } });
        } catch (e) {
            console.log(e);

            if (e instanceof ZodError) {
                return res.status(400).json({ success: false, message: e.message });
            }
            return res.status(500).send({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getAllLoans(req: Request, res: Response) {
        try {
            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;

            const count = await prisma.loanApplication.count({});

            // Get all loan applications of the user with pagination
            const loans: Loan[] = await prisma.loan.findMany({
                
                skip: offset,
                take: parsedLimit,
            });

            return res.status(200).json({ success: true, loans,page ,totalApplications: count });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getLoanById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const loan = await prisma.loan.findFirst({
                where: {
                    id,
                },
                include: {
                    documents: true,
                }
            });

            if (!loan) {
                return res.status(404).json({ success: false, message: "Loan Type not found" });
            }

            return res.status(200).json({
                success: true,
                data: {
                    loan
                }
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getAllLoanApplications(req: Request, res: Response) {
        try {
            const { status, order }: { status?: LoanStatus, order?: string } = req.query;

            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;

            const count = await prisma.loanApplication.count({
                orderBy: {
                    createdAt: order === 'asc' ? 'asc' : 'desc',
                }
            });

            // Get all loan applications of the user with pagination
            const applications: LoanApplication[] = await prisma.loanApplication.findMany({
                where: {
                    loanStatus: status
                },
                skip: offset,
                take: parsedLimit,
            });

            return res.status(200).json({
                success: true,
                data: {
                    totalApplications: count,
                    applications,
                    page,
                },
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getLoanApplicationById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const application = await prisma.loanApplication.findFirst({
                where: {
                    id,
                },
                include: {
                    bankDetails: true,
                    documents: true,
                }
            });

            if (!application) {
                return res.status(404).json({ success: false, message: "Loan Application not found" });
            }

            return res.status(200).json({
                success: true,
                data: {
                    application
                }
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: 'Something went wrong.' });
        }
    }

}
