import { Router } from "express";
import LoanController from "../controllers/loan.controller";
import verifyToken from "../middlewares/verify-token";
import bodyValidator from "../middlewares/body-validator";
import adminCheck from "../middlewares/admin-check";

const loanRouter = Router();

loanRouter.post('/applications', verifyToken, bodyValidator, LoanController.applyForLoan);
loanRouter.get('/applications', verifyToken, LoanController.getAppliedLoans);
loanRouter.get('/applications/:id', verifyToken, LoanController.getAppliedLoanById);

loanRouter.post('/loans', verifyToken, adminCheck, bodyValidator, LoanController.createLoan);
loanRouter.get('/loans/getAll', verifyToken, adminCheck, LoanController.getAllLoans);
loanRouter.get('/loans/:id', verifyToken, adminCheck,  LoanController.getLoanById);

loanRouter.get('/admin/applications', verifyToken, adminCheck, LoanController.getAllLoanApplications);
loanRouter.get('/admin/applications/:id', verifyToken, adminCheck, LoanController.getLoanApplicationById);

export default loanRouter;
