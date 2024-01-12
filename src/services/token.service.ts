import jwt from 'jsonwebtoken';
import { UserData } from '../types/user-data';

export default class TokenService {

    static getTokenFromAuthHeader(authorization: string|undefined) {
        const token = authorization?.split(' ').pop();

        return token;
    }

    static generateToken(user: Record<string, any>) {
        const token = jwt.sign(user, process.env.JWT_KEY as string, {
            issuer: "iTaxEasy",
            expiresIn: "1Y"
        });

        return token;
    }

    static decodeToken(token: string) {
        const result: UserData = jwt.decode(token) as UserData;

        return result;
    }

    static verifyToken(token: string) {
        const verified = jwt.verify(token, process.env.JWT_KEY as string);

        return verified;
    }

}