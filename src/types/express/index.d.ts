import express from "express";
import { UserData } from "../user-data";

declare global {
    namespace Express {
        interface Request {
            user?: UserData;
            isAdmin?: boolean;
        }
    }
}
