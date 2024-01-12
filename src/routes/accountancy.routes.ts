import { Router } from "express";
import verifyToken from "../middlewares/verify-token";
import bodyValidator from "../middlewares/body-validator";
import { LedgerController } from "../controllers/accountancy.controller";

const accountancyRouter = Router();

// const ledgerRouter = Router();

accountancyRouter.post('/create', verifyToken, bodyValidator, LedgerController.createLedger);

accountancyRouter.put('/update/:id', verifyToken, bodyValidator, LedgerController.updateLedger);

accountancyRouter.delete('/delete/:id', verifyToken, LedgerController.deleteLedger);

accountancyRouter.get('/account/:ledgerId', verifyToken, LedgerController.getLedgerById);

accountancyRouter.get('/party/:partyId', verifyToken, LedgerController.getLedgerByPartyId);

accountancyRouter.get('/all', verifyToken, LedgerController.getLedgers);

// accountancyRouter.use('/ledger', ledgerRouter);

export default accountancyRouter;
