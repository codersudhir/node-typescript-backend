import { Request, Response } from "express";

import pincodeData from '../data/pincodes.json';

interface PincodeEntry {
    pincode: number,
    officeName: string
}

export default class PincodeController {

    static lookupByPincode(pincode: string | number) {
        if (typeof pincode === 'string') {
            return (pincodeData as PincodeEntry[]).filter((e) => {
                return e.pincode === +pincode;
            });
        } else if (typeof pincode === 'number') {
            return (pincodeData as any[]).filter((e) => {
                return e.pincode === pincode;
            });
        }
    }

    static lookupByCity(city: string) {
        const regex = RegExp(city, 'i');

        return (pincodeData as PincodeEntry[]).filter((e) => {
            return e.officeName.match(regex);
        });
    }

    static async getPincodeByCity(req: Request, res: Response) {
        try {
            const { city } = req.query;

            if (!city) {
                return res.status(400).send({ success: false, message: 'Required field "city" is missing' });
            }

            const data = PincodeController.lookupByCity(city as string);

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

    static async getInfoByPincode(req: Request, res: Response) {
        try {
            const { pincode } = req.query;

            if (!pincode) {
                return res.status(400).send({ success: false, message: 'Required field "pincode" is missing' });
            }

            const data = PincodeController.lookupByPincode(pincode as string);

            return res.status(200).send({ success: true, data });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }

}