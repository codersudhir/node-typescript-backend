import axios from "axios";
import { Request, Response } from "express";
import Sandbox from "../../services/sandbox.service";

export default class CalculatorController {
    static async incomeTaxNewRegime(req: Request, res: Response) {
        try {
            if(!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Body Params missing" });
            }

            const endpoint = `${Sandbox.BASE_URL}/calculators/income-tax/new`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { data: { data } } = await axios.post(endpoint, req.body, {
                headers
            });

            return res.status(200).send({ success: true, data });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async incomeTaxOldRegime(req: Request, res: Response) {
        try {
            if(!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Body Params missing" });
            }

            const endpoint = `${Sandbox.BASE_URL}/calculators/income-tax/old`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { data: { data } } = await axios.post(endpoint, req.body, {
                headers
            });

            return res.status(200).send({ success: true, data });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async advanceIncomeTaxOldRegime(req: Request, res: Response) {
        try {
            if(!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Body Params missing" });
            }

            const endpoint = `${Sandbox.BASE_URL}/calculators/income-tax/advance-tax/old`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { data: { data } } = await axios.post(endpoint, req.body, {
                headers
            });

            return res.status(200).send({ success: true, data });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }

    static async advanceIncomeTaxNewRegime(req: Request, res: Response) {
        try {
            if(!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Body Params missing" });
            }

            const endpoint = `${Sandbox.BASE_URL}/calculators/income-tax/advance-tax/new`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { data: { data } } = await axios.post(endpoint, req.body, {
                headers
            });

            return res.status(200).send({ success: true, data });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }
}