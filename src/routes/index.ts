import { Request, Response, Router } from "express";

import userRouter from "./user.routes";
import businessProfileRouter from "./businessProfile.routes";
import invoiceRouter from "./invoice.routes";

import pincodeRouter from "./pincode.routes";
import cmsRouter from "./cms.routes";
import postOfficeRouter from "./postOffice.routes";
import servicesRouter from "./services.routes";
import paymentsRouter from "./payments.routes";
import paymentRouter from "./payment.routes";
import ordersRouter from "./orders.routes";

import libraryRouter from "./library.routes"
import blogRouter from "./blog.routes";
import panRouter from "./pan.routes";
import gstRouter from "./gst.routes";

import careerRouter from "./career.route"
import mcaRouter from "./mca.routes";
import calculatorRouter from "./calculators.routes";
import tanRouter from "./tan.routes";
import bankRouter from "./bank.routes";
import aadhaarRouter from "./aadhaar.routes";
import loanRouter from "./loan.routes";
import documentRouter from "./document.routes";
import visitorRouter from "./visitorCounter.routes"
import registerStartupRouter from "./registerStartup,routes";
import contactUsRouter from "./contactUs.routes";

import insourancerouter from "./insurance.routes";
import { registerAbout } from "./about.routes";
import accountancyRouter from "./accountancy.routes";

const router = Router();

router.use('/user', userRouter);

router.use('/business', businessProfileRouter);

router.use('/invoice', invoiceRouter);

router.use('/cms', cmsRouter);

router.use('/pincode', pincodeRouter);

router.use('/postOffice', postOfficeRouter);

router.use('/pan', panRouter);

router.use('/gst', gstRouter);

router.use('/accountancy', accountancyRouter);

router.use('/services', servicesRouter);

router.use('/payments', paymentsRouter);

router.use('/payment', paymentRouter);

router.use('/orders', ordersRouter);

router.use('/library', libraryRouter);

router.use('/blog', blogRouter);

router.use('/mca', mcaRouter);

router.use('/tan', tanRouter);

router.use('/bank', bankRouter);

router.use('/aadhaar', aadhaarRouter);

router.use('/calculator', calculatorRouter);

router.use('/career', careerRouter);

router.use('/loan', loanRouter);

router.use('/documents', documentRouter);

router.use('/insurance', documentRouter);

router.use('/visitorCount',visitorRouter)

router.use('/Startup',registerStartupRouter)

router.use('/contactUs',contactUsRouter)

router.use('/insourance',insourancerouter)

router.use('/aboutTeam',registerAbout)

router.get('/', (req, res) => {
    return res.send({ message: 'Up and running' });
});

const handlePageNotFound = (req: Request, res: Response) => {
    return res.status(404).send({ message: 'Endpoint not found' });
};

router.get('*', handlePageNotFound);

router.post('*', handlePageNotFound);

export default router;
