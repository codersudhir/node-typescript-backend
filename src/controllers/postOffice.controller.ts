import { Request, Response } from "express";

import axios from "axios";

export default class PostOfficeController {

    static async getPostData(pincode: string) {
        const res = await axios(`http://www.postalpincode.in/api/pincode/${pincode}`);

        return res.data;
    }

    static async getPostOfficeByPincode(req: Request, res: Response) {
        try {
            const { pincode } = req.query;

            if(!pincode) {
                return res.status(400).send({ success: false, message: 'Required field "pincode" is missing' });
            }

            const data = await PostOfficeController.getPostData(pincode as string);

            return res.status(200).send({ success: true, data });
        } catch(e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

}