import { Router } from "express";
import GSTController from "../controllers/sandbox/gst.controller";
import verifyToken from "../middlewares/verify-token";
import bodyValidator from "../middlewares/body-validator";
import queryValidator from "../middlewares/query-validator";

const gstRouter = Router();

gstRouter.get('/search/gstin/:gstin', verifyToken, GSTController.searchByGSTIN);

gstRouter.get('/search/gstin-by-pan', verifyToken, GSTController.searchGSTINNumberByPan);

gstRouter.post('/return/track', verifyToken, bodyValidator, GSTController.trackGSTReturn);

gstRouter.post('/tax-payer/registration', verifyToken, bodyValidator, GSTController.registerForGST);

gstRouter.post('/tax-payer/generate-otp', verifyToken, bodyValidator, GSTController.generateOTP);

gstRouter.post('/tax-payer/verify-otp', verifyToken, bodyValidator, GSTController.verifyOTP);

gstRouter.post('/tax-payer/file/proceed', verifyToken, bodyValidator, GSTController.proceedToFileGstr);

gstRouter.post('/tax-payer/file/gstr-4/:gstin/:year/:month', verifyToken, bodyValidator, GSTController.uploadGSTR4);

gstRouter.post('/tax-payer/file/gstr-3b/:gstin/:year/:month', verifyToken, bodyValidator, GSTController.uploadGSTR3B);

gstRouter.post('/tax-payer/file/gstr-3b/:gstin/:year/:month', verifyToken, bodyValidator, GSTController.uploadGSTR3B);

gstRouter.post('/tax-payer/file/gstr-3b/:gstin/:year/:month/file', verifyToken, bodyValidator, GSTController.uploadGSTR3B);

gstRouter.get('/tax-payer/summary/gstr-3b/:gstin/:year/:month', verifyToken, GSTController.getGSTR3BSummary);

//   ********* GSTR -1 ************

gstRouter.get('/tax-payer/file/gstr-1/at',verifyToken,queryValidator(['gstin','year','month']),GSTController.gstr1AT)

gstRouter.get('/tax-payer/file/gstr-1/ata',verifyToken,queryValidator(['gstin','year','month']),GSTController.gstr1ATA)

gstRouter.get('/tax-payer/file/gstr-1/b2b',verifyToken,GSTController.gstr1B2B)

gstRouter.get('/tax-payer/file/gstr-1/b2ba',verifyToken,GSTController.gstr1B2BA)

gstRouter.get('/tax-payer/file/gstr-1/b2cl',verifyToken,GSTController.gstr1B2CL)

gstRouter.get('/tax-payer/file/gstr-1/b2cla',verifyToken,GSTController.gstr1B2CLA)

gstRouter.get('/tax-payer/file/gstr-1/b2cs',verifyToken,GSTController.gstr1B2CS)

gstRouter.get('/tax-payer/file/gstr-1/b2csa',verifyToken,GSTController.gstr1B2CSA)

gstRouter.get('/tax-payer/file/gstr-1/cdnr',verifyToken,GSTController.gstr1CDNR)

gstRouter.get('/tax-payer/file/gstr-1/cdnra',verifyToken,GSTController.gstr1CDNRA)

gstRouter.get('/tax-payer/file/gstr-1/cdnur',verifyToken,GSTController.gstr1CDNUR)

gstRouter.get('/tax-payer/file/gstr-1/cdnura',verifyToken,GSTController.gstr1CDNURA)

gstRouter.get('/tax-payer/file/gstr-1/doc-issued',verifyToken,GSTController.gstr1DocumentIssued)

gstRouter.get('/tax-payer/file/gstr-1/exp',verifyToken,GSTController.gstr1EXP)

gstRouter.get('/tax-payer/file/gstr-1/expa',verifyToken,GSTController.gstr1EXPA)

gstRouter.get('/tax-payer/file/gstr-1/summary',verifyToken,GSTController.gstr1Summary)

gstRouter.get('/tax-payer/file/gstr-1/nil-supplies',verifyToken,GSTController.gstr1NILSupplies)

gstRouter.post('/tax-payer/file/gstr-1/save-gstr/:gstin/:year/:month', verifyToken, bodyValidator, GSTController.saveGstr1);

gstRouter.post('/tax-payer/file/gstr-1/reset', verifyToken, bodyValidator, GSTController.resetGstr1);

gstRouter.post('/tax-payer/file/gstr-1/file', verifyToken, bodyValidator, GSTController.fileGSTR1);


// ***************************GSTR -2A Start*******************
gstRouter.get('/tax-payer/file/gstr-2a/b2b',verifyToken,GSTController.gstr2aB2B)

gstRouter.get('/tax-payer/file/gstr-2a/b2ba',verifyToken,GSTController.gstr2aB2BA)

gstRouter.get('/tax-payer/file/gstr-2a/cdn',verifyToken,GSTController.gstr2aCDN)

gstRouter.get('/tax-payer/file/gstr-2a/cdna',verifyToken,GSTController.gstr2aCDNA)

gstRouter.get('/tax-payer/file/gstr-2a/isd',verifyToken,GSTController.gstr2aISD)

gstRouter.get('/tax-payer/file/gstr-2a/',verifyToken,GSTController.gstr2A)

// ***************************GSTR -2B Start*******************
gstRouter.get('/tax-payer/file/gstr-2b',verifyToken,GSTController.gstr2B)

export default gstRouter;
