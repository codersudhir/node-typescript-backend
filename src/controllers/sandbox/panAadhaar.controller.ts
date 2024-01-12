import { Request, Response } from "express";
import Sandbox from "../../services/sandbox.service";
import axios from "axios";

export default class PanAadhaarController {

    static async checkLinkStatus(req: Request, res: Response) {
        try {
            const { pan, aadhaar } = req.query;

            if (!pan) {
                return res.status(400).json({ success: false, message: 'Enter a valid PAN Number' });
            }

            if (!aadhaar) {
                return res.status(400).json({ success: false, message: 'Enter a valid Aadhaar Number' });
            }

            const endpoint = `${Sandbox.BASE_URL}/it-tools/pans/${pan}/pan-aadhaar-status`;

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
                    aadhaar_number: aadhaar
                }
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