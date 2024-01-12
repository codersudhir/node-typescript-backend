import { Request, Response } from "express";
import Sandbox from "../../services/sandbox.service";
import axios from "axios";

export default class BankController {

    static async getBankDetailsByIfsc(req: Request, res: Response) {
        try {
            const { ifsc } = req.query;

            if (!ifsc) {
                return res.status(400).json({ success: false, message: 'Query Parameter "ifsc" is missing' });
            }

            const endpoint = `${Sandbox.BASE_URL}/bank/${ifsc}`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data } = await axios.get(endpoint, {
                headers,
            });

            if(status !== 200) {
                return res.status(500).send({ success: false, message: "Something went wrong" });
            }

            console.log(data);

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: "Something went wrong" });
        }
    }

    static async verifyBankAccount(req: Request, res: Response) {
        try {
            const { ifsc, name, accountNumber, mobile } = req.body;

            if (!ifsc || !name || !accountNumber || !mobile) {
                return res.status(400).json({ success: false, message: 'Required Query Parameters are missing' });
            }

            const endpoint = `${Sandbox.BASE_URL}/bank/${ifsc}/accounts/${accountNumber}/verify?name=${name}&mobile=${mobile}`;

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

            if(status !== 200) {
                return res.status(500).send({ success: false, message: "Something went wrong" });
            }

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false, message: "Something went wrong" });
        }
    }

    static async upiVerification(req: Request, res: Response) {
        try {
            const { virtual_payment_address,name } = req.query;

            if(!virtual_payment_address || !name) {
                return res.status(400).json({ success: false, message: 'Required Query parameter was not provided' });
            }

            const endpoint = `${Sandbox.BASE_URL}/bank/upi/${virtual_payment_address}`;

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

            if(status !== 200) {
                return res.status(500).send({ success: false, message: "Something went wrong" });
            }
            
            return res.status(200).json({ success: true, data });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ status: false, message: 'Something went wrong ,' });
        }
    }

}