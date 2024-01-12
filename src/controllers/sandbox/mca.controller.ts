import { Request, Response } from "express";
import Sandbox from "../../services/sandbox.service";
import axios from "axios";

export default class MCAController {

    static async getCompanyByCIN(req: Request, res: Response) {
        try {
            const { cin } = req.query;

            if(!cin) {
                return res.status(400).json({ success: false, message: 'Query parameter CIN was not provided' });
            }

            const endpoint = `${Sandbox.BASE_URL}/mca/companies/${cin}`;

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
            return res.status(500).json({ status: false, message: 'Something went wrong' });
        }
    }


    static async getDirectorByDIN(req: Request, res: Response) {
        try {
            const { din } = req.query;

            if(!din) {
                return res.status(400).json({ success: false, message: 'Query parameter DIN was not provided' });
            }

            const endpoint = `${Sandbox.BASE_URL}/mca/directors/${din}`;

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
            return res.status(500).json({ status: false, message: 'Something went wrong' });
        }
    }

}