import { Request, Response } from "express";
import { GSTIN_RGX, validateGSTIN } from "../../lib/util";
import Sandbox from "../../services/sandbox.service";
import axios from "axios";
import { z } from "zod";

const GSTR4_SCHEMA = z.object({
    gstin: z.string({ required_error: 'GSTIN Number is required' }).regex(GSTIN_RGX, "Invalid GSTIN Number"),
    fp: z.string(),
    txos: z.object({
        samt: z.number(),
        rt: z.number(),
        camt: z.number(),
        trnovr: z.number(),
    }),
});
const GSTR1_SCHEMA = z.object({
    gstin: z.string({ required_error: 'GSTIN Number is required' }).regex(GSTIN_RGX, "Invalid GSTIN Number"),
    fp: z.string(),
    gt: z.number(),
    cur_gt: z.number()
    ,
});


export default class GSTController {

    static async searchByGSTIN(req: Request, res: Response) {
        try {
            const { gstin } = req.params;

            if (!validateGSTIN(gstin)) {
                return res.status(400).json({ success: false, message: "Please enter valid GSTIN" });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/public/gstin/`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,
                params: {
                    gstin
                }
            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Something went wrong" });
            }

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async searchGSTINNumberByPan(req: Request, res: Response) {
        try {
            const { pan, gst_state_code } = req.query;

            if (!pan || !gst_state_code) {
                return res.status(400).json({ success: false, message: "Required query params missing" });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/public/pan/${pan}?state_code=${gst_state_code}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,
            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Something went wrong" });
            }

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async trackGSTReturn(req: Request, res: Response) {
        try {
            const { gstin, financialYear } = req.body;

            if (!validateGSTIN(gstin)) {
                return res.status(400).json({ success: false, message: "Please enter valid GSTIN" });
            }

            if (!financialYear) {
                return res.status(400).json({ success: false, message: "Please enter valid Financial Year" });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/public/gstr?gstin=${gstin}&financial_year=${financialYear}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,
                params: {
                    gstin
                }
            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Something went wrong" });
            }

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async proceedToFileGstr(req: Request, res: Response) {
        try {
            const { gstin, returnPeriod, year, month, returnType, isNil } = req.body;

            if (!validateGSTIN(gstin)) {
                return res.status(400).json({ success: false, message: "Please enter valid GSTIN" });
            }

            if (!returnPeriod || !year || !month || !returnType || !isNil) {
                return res.status(400).json({ success: false, message: "Required Body Params missing" });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/${returnType}/${year}/${month}/proceed?is_nil=${isNil}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.post(endpoint, {
                gstin,
                ret_period: returnPeriod
            }, {
                headers,
            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Something went wrong" });
            }

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async registerForGST(req: Request, res: Response) {
        try {
            const { gstin, payload } = req.body;

            if (!validateGSTIN(gstin)) {
                return res.status(400).json({ success: false, message: "Please enter valid GSTIN" });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/registration`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.post(endpoint, payload, {
                headers,
            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Something went wrong" });
            }

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async generateOTP(req: Request, res: Response) {
        try {
            const { gstin, username } = req.body;

            if (!validateGSTIN(gstin)) {
                return res.status(400).json({ success: false, message: "Please enter valid GSTIN" });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/otp?username=${username}`;
            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.post(endpoint, {}, {
                headers,
            });

            if (status === 401) {
                return res.status(401).send({ success: false, message: 'Unauthorized Access' });
            }

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async verifyOTP(req: Request, res: Response) {
        try {
            const { gstin, username, otp } = req.body;

            if (!validateGSTIN(gstin)) {
                return res.status(400).json({ success: false, message: "Please enter valid GSTIN" });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/otp/verify?username=${username}&otp=${otp}`;
            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const response = await axios.post(endpoint, {}, {
                headers,
            });

            if (response.status !== 200) {
                return res.status(500).send({ success: true, message: "Could not authenticate. Something went wrong" });
            }

            return res.status(200).send({ success: true, message: `GSTIN: ${gstin} authenticated successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    /**
     * Upload GSTR-4
     */

    static async uploadGSTR4(req: Request, res: Response) {
        try {
            const data = GSTR4_SCHEMA.parse(req.body);

            const { gstin, year, month } = req.params;

            if (!year || !month) {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-4/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const response = await axios.post(endpoint, data, {
                headers,
            });

            if (response.status !== 200) {
                return res.status(500).send({ success: true, message: "Could not upload GSTR 4" });
            }

            return res.status(200).send({ success: true, message: `GSTR-4 Uploaded successfully!`, reference_id: response.data.reference_id });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    /**
     * Upload GSTR-3B
     */

    static async uploadGSTR3B(req: Request, res: Response) {
        try {
            const body = req.body;

            const { gstin, year, month } = req.params;

            if (!validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || !month) {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-3b/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const response = await axios.post(endpoint, body, {
                headers,
            });

            if (response.status !== 200) {
                return res.status(500).send({ success: true, message: "Could not upload GSTR 4" });
            }

            return res.status(200).send({ success: true, message: `GSTR-3B Uploaded successfully!`, reference_id: response.data.reference_id });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    /**
     * File GSTR-3B
     */

    static async fileGSTR3B(req: Request, res: Response) {
        try {
            const body = req.body;

            const { gstin, year, month } = req.params;

            if (!validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || !month) {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-3b/${year}/${month}/file`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const response = await axios.post(endpoint, body, {
                headers,
            });

            if (response.status !== 200) {
                return res.status(500).send({ success: true, message: "Could not upload GSTR 4" });
            }

            return res.status(200).send({ success: true, message: `GSTR-3B Filed successfully!`, reference_id: response.data.reference_id });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    /**
     * GSTR 3B Summary
     */
    static async getGSTR3BSummary(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.params;

            if (!validateGSTIN(gstin)) {
                return res.status(400).json({ success: false, message: "Please enter valid GSTIN" });
            }

            if (!year || !month) {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-3b/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers
            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Something went wrong" });
            }

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }



    // ********   gstr 1   *********
    static async gstr1AT(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/at/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,
            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 AT" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 AT found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }


    static async gstr1ATA(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/ata/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,
            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 ATA" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 ATA found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1B2B(req: Request, res: Response) {
        try {
            const { gstin, year, month, ctin, action_required, from } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!ctin || !action_required || !from) {
                return res.status(400).send({ success: false, message: 'ctin ,action_required ,from are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/b2b/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 B2B" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 B2B found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1B2BA(req: Request, res: Response) {
        try {
            const { gstin, year, month, ctin, action_required, from } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!ctin || !action_required || !from) {
                return res.status(400).send({ success: false, message: 'ctin ,action_required ,from are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/b2ba/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 B2BA" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 B2BA found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1B2CL(req: Request, res: Response) {
        try {
            const { gstin, year, month, state_code } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!state_code) {
                return res.status(400).send({ success: false, message: 'state_code are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/b2cl/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 B2CL" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 B2CL found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1B2CLA(req: Request, res: Response) {
        try {
            const { gstin, year, month, state_code } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!state_code) {
                return res.status(400).send({ success: false, message: 'state_code are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/b2cla/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 B2CLA" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 B2CLA found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1B2CS(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/b2cs/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 B2CS" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 B2CS found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1B2CSA(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/b2csa/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 B2CSA" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 B2CSA found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1CDNR(req: Request, res: Response) {
        try {
            const { gstin, year, month, action_required, from } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!action_required || !from) {
                return res.status(400).send({ success: false, message: 'action_required AND from are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/cdnr/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 CDNR" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 CDNR found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1CDNRA(req: Request, res: Response) {
        try {
            const { gstin, year, month, action_required, from } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!action_required || !from) {
                return res.status(400).send({ success: false, message: 'action_required AND from are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/cdnra/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 CDNRA" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 CDNRA found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1CDNUR(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/cdnur/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 CDNUR" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 CDNUR found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1CDNURA(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/cdnura/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 CDNURA" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 CDNURA found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1DocumentIssued(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/doc-issue/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 Document Isued" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 Document Isued found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1EXP(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/exp/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 EXP" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 EXP found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1EXPA(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/expa/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 EXPA" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 EXPA found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1Summary(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 Summary" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 Summary found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1HSNSummary(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/hsn/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 HSN Summary" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 HSN Summary found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr1NILSupplies(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/nil/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -1 NIL Summary" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-1 NIL Summary found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }


    static async saveGstr1(req: Request, res: Response) {
        try {
            const data = GSTR1_SCHEMA.parse(req.body);

            const { gstin, year, month } = req.params;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || !month) {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const response = await axios.post(endpoint, data, {
                headers,
            });

            if (response.status !== 200) {
                return res.status(500).send({ success: true, message: "Could not Save GSTR 1" });
            }

            return res.status(200).send({ success: true, message: ` Save GSTR-1  successfully!`, reference_id: response.data.reference_id });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async resetGstr1(req: Request, res: Response) {
        try {
            const data = (req.body);

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/:gstin/gstrs/gstr-1/:year/:month/reset`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const response = await axios.post(endpoint, data, {
                headers,
            });

            if (response.status !== 200) {
                return res.status(500).send({ success: true, message: "Could not Reset GSTR 1" });
            }

            return res.status(200).send({ success: true, message: ` Reset GSTR-1  successfully!`, reference_id: response.data.reference_id });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async fileGSTR1(req: Request, res: Response) {
        try {
            const body = req.body;

            const { gstin, year, month, pan, otp } = req.params;

            if (!validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || !month) {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!pan || !otp) {
                return res.status(400).send({ success: false, message: 'pan and otp are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-1/${year}/${month}/file`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const response = await axios.post(endpoint, body, {
                headers,
            });

            if (response.status !== 200) {
                return res.status(500).send({ success: true, message: "Could not File GSTR 1" });
            }

            return res.status(200).send({ success: true, message: `GSTR-1 Filed successfully!`, reference_id: response.data.reference_id });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    // **********Return GSTR-2A******************

    static async gstr2aB2B(req: Request, res: Response) {
        try {
            const { gstin, year, month, ctin } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!ctin) {
                return res.status(400).send({ success: false, message: 'ctin  are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-2a/b2b/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -2 B2B" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-2 B2B found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }


    static async gstr2aB2BA(req: Request, res: Response) {
        try {
            const { gstin, year, month, ctin } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!ctin) {
                return res.status(400).send({ success: false, message: 'ctin  are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-2a/b2ba/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -2 B2BA" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-2 B2BA found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }


    static async gstr2aCDN(req: Request, res: Response) {
        try {
            const { gstin, year, month, ctin } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!ctin) {
                return res.status(400).send({ success: false, message: 'ctin  are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-2a/cdn/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -2 CDN" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-2 CDN found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr2aCDNA(req: Request, res: Response) {
        try {
            const { gstin, year, month, ctin } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }
            if (!ctin) {
                return res.status(400).send({ success: false, message: 'ctin  are required' })
            }

            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-2a/cdna/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -2 CDNA" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-2 CDNA found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr2aISD(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-2a/isd/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -2 ISD" });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-2 ISD found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async gstr2A(req: Request, res: Response) {
        try {
            const { gstin, year, month } = req.query;

            if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
                return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
            }

            if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
                return res.status(400).send({ success: false, message: 'Year and Month are required' });
            }


            const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-2a/${year}/${month}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.get(endpoint, {
                headers,

            });

            if (status !== 200) {
                return res.status(500).send({ success: false, message: "Could not find GSTR -2 " });
            }

            return res.status(200).send({ success: true, data, message: `GSTR-2  found successfully!` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

// ************************* GSTR -2B *********************************

static async gstr2B(req: Request, res: Response) {
    try {
        const { gstin, year, month } = req.query;

        if (!gstin || typeof gstin !== 'string' || !validateGSTIN(gstin)) {
            return res.status(400).send({ success: false, message: 'Invalid GSTIN Number' });
        }

        if (!year || typeof year !== 'string' || !month || typeof month !== 'string') {
            return res.status(400).send({ success: false, message: 'Year and Month are required' });
        }

        const endpoint = `${Sandbox.BASE_URL}/gsp/tax-payer/${gstin}/gstrs/gstr-2b/${year}/${month}`;

        const token = await Sandbox.generateAccessToken();

        const headers = {
            'Authorization': token,
            'accept': 'application/json',
            'x-api-key': process.env.SANDBOX_KEY,
            'x-api-version': process.env.SANDBOX_API_VERSION
        };

        const { status, data: { data } } = await axios.get(endpoint, {
            headers,

        });

        if (status !== 200) {
            return res.status(500).send({ success: false, message: "Could not find GSTR -2B " });
        }

        return res.status(200).send({ success: true, data, message: `GSTR-2B  found successfully!` });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

























}
