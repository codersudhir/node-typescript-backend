import { UserData } from "./src/types/user-data";

declare namespace Express {
  export interface Request {
    user?: UserData;
    isAdmin?: boolean;
  }
}