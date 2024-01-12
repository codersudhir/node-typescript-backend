import { Request, Response } from "express";
import { prisma } from "..";
import { Ledger } from "@prisma/client";

export class LedgerController {
    static async createLedger(req: Request, res: Response) {
        try {

            if (!req.user) {
                return res.status(400).json({ success: false, message: "User information missing in request." });
            }    
            const { id: userId } = req.user!;

            const { ledgerName, ledgerType, openingBalance } = req.body;

            const ledger = await prisma.ledger.create({
                data: { ledgerName, ledgerType, openingBalance, userId, },
            });

            return res.json(ledger);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Error creating ledger" });
        }
    }

    static async updateLedger(req: Request, res: Response) {
        try {
          const ledgerId = req.params.id;
    
          
          if (!ledgerId) {
            return res.status(400).json({ success: false, message: "Ledger ID is missing in the request." });
          }
    
          const { ledgerName, ledgerType, openingBalance } = req.body;
    
          const updatedLedger = await prisma.ledger.update({
            where: { id: ledgerId },
            data: { ledgerName, ledgerType, openingBalance },
          });
    
          return res.json(updatedLedger);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: "Error updating ledger" });
        }
      }

      static async deleteLedger(req: Request, res: Response) {
        try {
          const ledgerId = req.params.id;
    
          if (!ledgerId) {
            return res.status(400).json({ success: false, message: "Ledger ID is missing in the request." });
          }

          console.log("id :", ledgerId)
    
          const deletedLedger = await prisma.ledger.delete({
            where: { id: ledgerId },
          });
    
          return res.json({ success: true, deletedLedger, message: "Ledger deleted successfully" });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: "Error deleting ledger" });
        }
      }

    static async getLedgers(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const ledgers = await prisma.ledger.findMany({
                where: {
                    userId,
                }
            });
            return res.status(200).json({ success: true, ledgers });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error fetching ledgers" });
        }
    }

    static async getLedgerById(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const ledgerId = req.params.id;

            const ledger: Ledger | null = await prisma.ledger.findFirst({ where: { id: ledgerId, userId }});

            if (!ledger) {
                return res.status(404).json({ success: false, message: 'Ledger not found' });
            }

            return res.status(200).json({ success: true, ledger });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getLedgerByPartyId(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const date = new Date();

            const currentYear = date.getFullYear();
            const currentMonth = date.getMonth();

            const { id: partyId } = req.params;

            const { year, month } = req.query;

            const ledger: Ledger | null = await prisma.ledger.findFirst({ where: {
                partyId,
                year: year ? parseInt(year as string) : currentYear,
                month: month ? parseInt(month as string) : currentMonth,
                userId,
            }});

            if (!ledger) {
                return res.status(404).json({ success: false, message: 'Ledger not found' });
            }

            return res.status(200).json({ success: true, ledger });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

export class JournalEntryController {
    static async createJournalEntry(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const { entryDate, description, transactions } = req.body;

            const journalEntry = await prisma.journalEntry.create({
                data: { 
                    entryDate,
                    description,
                    userId,
                    transactions: {
                        create: transactions.map((transaction: any) => ({
                            userId,
                            ...transaction
                        }))
                    }
                },
            });
            return res.status(200).json({ success: true, journalEntry });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error creating journal entry" });
        }
    }

    static async getJournalEntries(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;

            const journalEntries = await prisma.journalEntry.findMany({
                where: {
                    userId,
                }
            });
            return res.status(200).json({ success: true, journalEntries });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error fetching journal entries" });
        }
    }
}

export class TransactionController {
    static async getTransactions(req: Request, res: Response) {
        try {
            const { id: userId } = req.user!;
            const { ledgerId } = req.body;

            const transactions = await prisma.transaction.findMany({
                where: {
                    userId,
                    ledgerId,
                }
            });

            return res.status(200).json({ success: true, transactions });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error fetching transactions" });
        }
    }
}
