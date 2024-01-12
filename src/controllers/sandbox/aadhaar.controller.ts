import { Request, Response } from "express";
import Sandbox from "../../services/sandbox.service";
import axios from "axios";

export default class AadhaarController {

    static async aadharGenerateOtp(req: Request, res: Response) {
        try {
            const { aadhaar_number } = req.body;

            if(!aadhaar_number) {
                return res.status(400).json({ success: false, message: 'Body parameter aadhaar_number was not provided' });
            }

            const endpoint = `${Sandbox.BASE_URL}/kyc/aadhaar/okyc/otp`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.post(endpoint, req.body,{
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
    
    static async aadhaarVerifyOtp(req: Request, res: Response) {
        try {
            const {  otp ,ref_id} = req.body;

            if(!otp) {
                return res.status(400).json({ success: false, message: 'Body parameter otp was not provided' });
            }
            if(!ref_id) {
                return res.status(400).json({ success: false, message: 'Body parameter ref_id was not provided' });
            }

            const endpoint = `${Sandbox.BASE_URL}/kyc/aadhaar/okyc/otp/verify`;
            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const response = await axios.post(endpoint, req.body, {
                headers,
            });

            if(response.status !== 200) {
                return res.status(500).json({ success: false, message: "Could not verify. Something went wrong" });
            }

            return res.status(200).send({ success: true, message: `OTP: ${otp} verify successfully!` });
        } catch(e) {
            // console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong ' });
        }
    }
   






    static async verifyAadhaar(req: Request, res: Response) {
        try {
            const { aadhaar_number } = req.query;

            const endpoint = `${Sandbox.BASE_URL}/aadhaar/verify?consent=Y&reason=For%20KYC%20of%20User`;

            const token = await Sandbox.generateAccessToken();

            const headers = {
                'Authorization': token,
                'accept': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'x-api-version': process.env.SANDBOX_API_VERSION
            };

            const { status, data: { data } } = await axios.post(endpoint, {
                aadhaar_number
            }, {
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