import { Request, Response } from 'express';
import { Prisma, Invoice, InvoiceItem, Item, LedgerType, Party, PartyType } from '@prisma/client';
import { prisma } from '../index';

class InvoiceController {

    static async summary(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const totalSales = await prisma.invoice.aggregate({
                where: {
                    userId,
                    type: { in: ['sales', 'sales_return'] },
                },
                _sum: {
                    totalAmount: true,
                },
            });

            const totalPurchases = await prisma.invoice.aggregate({
                where: {
                    userId,
                    type: { in: ['purchase', 'purchase_return'] },
                },
                _sum: {
                    totalAmount: true,
                },
            });

            const numberOfParties = await prisma.party.count({
                where: {
                    userId,
                },
            });

            const numberOfItems = await prisma.item.count({
                where: {
                    userId,
                },
            });

            return res.status(200).json({
                success: true,
                summary: {
                    total_sales: totalSales._sum.totalAmount ?? 0,
                    total_purchases: totalPurchases._sum.totalAmount ?? 0,
                    number_of_parties: numberOfParties,
                    number_of_items: numberOfItems,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async create(req: Request, res: Response) {
       
            const { id: userId } = req.user!; 

            // Create the invoice
            const {
                invoiceNumber,
                gstNumber,
                type,
                partyId,
                totalAmount,
                totalGst,
                stateOfSupply,
                cgst,
                sgst,
                igst,
                utgst,
                details,
                extraDetails,
                invoiceItems,
                modeOfPayment,
                credit = false,
                status
            } = req.body;

            if (partyId) {
                const party = await prisma.party.findUnique({ where: { id: partyId } });

                if (!party) {
                    return res.status(401).json({ success: false, message: 'Party not found' });
                }
            }

            const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/;

            if (!gstRegex.test(gstNumber)) {
                return res.status(400).json({ error: 'Invalid GST number' });
            }

            // Check if invoiceItems is defined and is an array
            const formattedInvoiceItems = invoiceItems
                ? invoiceItems.map(({ itemId, quantity, discount }: { itemId: string; quantity: number; discount: number }) => ({
                    item: {
                        connect: {
                            id: itemId,
                        },
                    },
                    quantity,
                    discount,
                }))
                : [];

            const invoiceData: Prisma.InvoiceCreateInput = {
                invoiceNumber,
                gstNumber,
                type,
                party: {
                    connect: { id: partyId },
                },
                totalAmount,
                totalGst,
                stateOfSupply,
                cgst,
                sgst,
                igst,
                utgst,
                details,
                extraDetails,
                modeOfPayment,
                credit,
                status,
                invoiceItems: {
                    create: formattedInvoiceItems,
                },
                user: {
                    connect: { id: userId },
                },
            };

            const invoice = await prisma.invoice.create({
                data: invoiceData,
                include: {
                    invoiceItems: {
                        include: {
                            item: true,
                        },
                    },
                },
            });

            return res.status(201).json(invoice);
        
    }


    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { id: userId } = req.user!;

            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;

            // Get all invoices for the user with pagination
            const invoices: Invoice[] = await prisma.invoice.findMany({
                where: { userId },
                skip: offset,
                take: parsedLimit,
                include: {
                    invoiceItems: true
                }
            });

            res.status(200).json({ success: true, invoices });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const invoiceId = req.params.id;

            // Get the invoice by ID
            const invoice: Invoice | null = await prisma.invoice.findUnique({
                where: { id: invoiceId },
                include: {
                    invoiceItems: true
                }
            });

            if (!invoice) {
                res.status(404).json({ sucess: false, message: 'Invoice not found' });
                return;
            }

            res.status(200).json(invoice);
        } catch (error) {
            res.status(500).json({ sucess: false, message: 'Internal server error' });
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const invoiceId = req.params.id;
            const { invoiceNumber, gstNumber, type, partyId, totalAmount, totalGst, stateOfSupply, cgst, sgst, igst, utgst, details, extraDetails, items, status } = req.body;

            const { id: userId } = req.user!;

            const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, userId } });

            if (!invoice) {
                res.status(200).json({ success: false, message: 'Invoice not found' });
                return;
            }

            // Update the invoice
            const updatedInvoice: Invoice | null = await prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    invoiceNumber,
                    gstNumber,
                    type,
                    partyId,
                    totalAmount,
                    totalGst,
                    stateOfSupply,
                    cgst,
                    sgst,
                    igst,
                    utgst,
                    details,
                    extraDetails,
                    status,
                    invoiceItems: {
                        upsert: items.map((item: InvoiceItem) => ({
                            where: { id: item.id },
                            create: item,
                            update: item,
                        })),
                    },
                },
            });

            res.status(200).json({ sucess: true, updatedInvoice });
        } catch (error) {
            res.status(500).json({ sucess: false, message: 'Internal server error' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const invoiceId = req.params.id;

            const { id: userId } = req.user!;

            const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, userId } });

            if (!invoice) {
                return res.status(200).json({ success: false, message: 'Invoice not found' });
            }

            await prisma.invoiceItem.deleteMany({ where: { invoiceId } });

            // Delete the invoice
            const deletedInvoice: Invoice | null = await prisma.invoice.delete({ where: { id: invoiceId } });

            return res.status(200).json({ success: true, deletedInvoice });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async createParty(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const date = new Date();

            const currentYear = date.getFullYear();
            const currentMonth = date.getMonth();

            // Extract data for creating the party and ledger
            const {
                partyName,
                type,
                gstin,
                pan,
                tan,
                upi,
                email,
                phone,
                address,
                bankName,
                bankAccountNumber,
                bankIfsc,
                bankBranch,
                openingBalance,
                year = currentYear,
                month = currentMonth,
            } = req.body;

            // Create the Party and its associated Ledger
            const party = await prisma.party.create({
                data: {
                    partyName,
                    type,
                    gstin,
                    pan,
                    tan,
                    upi,
                    email,
                    phone,
                    address,
                    bankName,
                    bankAccountNumber,
                    bankIfsc,
                    bankBranch,
                    userId,
                    ledgers: {
                        create: {
                            ledgerName: partyName,
                            ledgerType: type === PartyType.customer ? LedgerType.accountsReceivable : LedgerType.accountsPayable,
                            openingBalance,
                            year,
                            month,
                            userId,
                        },
                    },
                },
                include: {
                    ledgers: true
                }
            });

            return res.status(201).json({ success: true, party });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async deleteParty(req: Request, res: Response) {
        try {
            const partyId = req.params.id;

            const { id: userId } = req.user!;

            const party = await prisma.party.findFirst({ where: { id: partyId, userId } });

            if (!party) {
                return res.status(200).json({ success: false, message: 'Party not found' });
            }

            // Delete the party
            const deletedParty: Party | null = await prisma.party.delete({ where: { id: partyId } });

            return res.status(200).json({ success: true, deletedParty });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async createItem(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            // Create the item
            const { itemName, unit, price, openingStock, closingStock, purchasePrice, gst, taxExempted, description, hsnCode, categoryId, supplierId } = req.body;

            const item: Item = await prisma.item.create({
                data: {
                    itemName,
                    unit,
                    price,
                    openingStock,
                    closingStock,
                    purchasePrice,
                    gst,
                    userId,
                    taxExempted,
                    description,
                    hsnCode,
                    categoryId,
                    supplierId,
                },
            });

            return res.status(201).json({ success: true, item });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async updateItem(req: Request, res: Response): Promise<void> {
        try {
            const itemId = req.params.id;
            const { itemName } = req.body;
            const { id: userId } = req.user!;
            const item = await prisma.item.findFirst({ where: { id: itemId, userId } });

            if (!item) {
                res.status(200).json({ success: false, message: 'Item not found' });
                return;
            }
            // Update the item
            const updatedItem: Item | null = await prisma.item.update({
                where: { id: itemId },
                data: {
                    itemName
                }
            });
            console.log("updateItem");
            console.log(updatedItem);
            res.status(200).json({ sucess: true, item: updatedItem });
        } catch (error) {
            res.status(500).json({ sucess: false, message: 'Internal server error' });
        }
    }

    static async deleteItem(req: Request, res: Response) {
        try {
            const itemId = req.params.id;

            const { id: userId } = req.user!;

            const item = await prisma.item.findFirst({ where: { id: itemId, userId } });

            if (!item) {
                return res.status(404).json({ success: false, message: 'Item does not exists.' });
            }

            // Delete the invoice
            const deletedItem: Item | null = await prisma.item.delete({ where: { id: itemId } });

            return res.status(200).json({ success: true, deletedItem });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getAllParties(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            // Pagination parameters
            const { page = 1, limit = 10, search } = req.query;

            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);
            // const regEx = new RegExp('^[0-9a-zA-Z]+$');
            // const searchString = search != undefined ? search.toString(): "";
            // console.log(typeof search,search?.length,regEx.test(searchString));
            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;
            let where;
            if (search == undefined)
                where = { userId }
            else {
                const regEx = new RegExp('^[0-9a-zA-Z]+$');
                const searchString = search.toString();
                if (searchString.length > 3 && regEx.test(searchString)) {
                    where = {
                        userId, partyName: {
                            search: "*" + search + "*"
                        }
                    };
                } else
                    return res.status(200).json({ success: true, parties: [] });
            }

            // Get all parties of the user with pagination
            const parties: Party[] = await prisma.party.findMany({
                where,
                skip: offset,
                take: parsedLimit,
            });

            return res.status(200).json({ success: true, parties });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getPartyById(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const partyId = req.params.id;

            // Get the party by ID
            const party: Party | null = await prisma.party.findFirst({
                where: { id: partyId, userId }, include: {
                    ledgers: true
                }
            });

            if (!party) {
                return res.status(404).json({ success: false, message: 'Party not found' });
            }

            return res.status(200).json({ success: true, party });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getAllItems(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            // Pagination parameters
            const { page = 1, limit = 10, search } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;
            let where;
            if (search == undefined)
                where = { userId }
            else {
                const regEx = new RegExp('^[0-9a-zA-Z]+$');
                const searchString = search.toString();
                if (searchString.length > 3 && regEx.test(searchString)) {
                    where = {
                        userId, itemName: {
                            search: "*" + search + "*"
                        }
                    };
                } else
                    return res.status(200).json({ success: true, parties: [] });
            }

            // Get all parties of the user with pagination
            const items: Item[] = await prisma.item.findMany({
                where,
                skip: offset,
                take: parsedLimit,
            });

            return res.status(200).json({ success: true, items });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getItemById(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const itemId = req.params.id;

            // Get the party by ID
            const item: Item | null = await prisma.item.findFirst({ where: { id: itemId, userId } });

            if (!item) {
                return res.status(404).json({ success: false, message: 'Item not found' });
            }

            return res.status(200).json({ success: true, item });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

}

export default InvoiceController;
