import { Request, Response } from "express";
import Sandbox from "../../services/sandbox.service";
import axios from "axios";

export default class TanController {

    static async searchByTanNo(req: Request, res: Response) {
        try {
            const { tan } = req.query;

            if (!tan) {
                return res.status(400).json({ success: false, message: 'Enter a valid TAN Number' });
            }

            const endpoint = `${Sandbox.BASE_URL}/itd/portal/public/tans/${tan}?consent=y&reason=For%20KYC%20of%20the%20organization`;

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

}