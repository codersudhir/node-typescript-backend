import { NextFunction, Request, Response } from "express";

const queryValidator = (requiredParams: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const keys = Object.keys(req.query);

    const missingParams = requiredParams.filter(param => !keys.includes(param));
    
    if(missingParams.length) {
        const message = `Required Query Params ${missingParams.join(', ')} are missing.`;

        return res.status(400).json({ success: false, message });
    }

    next();
};

export default queryValidator;