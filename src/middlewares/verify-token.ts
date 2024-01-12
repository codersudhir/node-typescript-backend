import { NextFunction, Request, Response } from "express";
import TokenService from "../services/token.service";
import { UserType } from "@prisma/client";

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = TokenService.getTokenFromAuthHeader(req.headers.authorization);

    if(!token) {
        return res.status(403).send({ success: false, message: 'Authorization Token is required' });
    }

    const verified = TokenService.verifyToken(token);

    if(!verified) {
        return res.status(401).send({ success: false, message: 'Unauthorized: Access is denied due to invalid credentials' });
    }

    const user = TokenService.decodeToken(token);

    req.user = user;
    req.isAdmin = user.userType === UserType.admin;

    next();
}
