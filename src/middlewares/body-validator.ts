import { NextFunction, Request, Response } from "express";

const bodyValidator = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: 'JSON body missing' });
    }

    next();
};

export default bodyValidator;