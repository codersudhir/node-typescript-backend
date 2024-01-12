import { UserType } from "@prisma/client";

export interface UserData {
    id: number,
    firstName: string,
    lastName: string|null,
    address: string|null,
    aadhaar: string|null,
    pan: string|null,
    email: string,
    phone: string|null,
    verified: boolean|null,
    userType: UserType,
    createdAt: Date,
}