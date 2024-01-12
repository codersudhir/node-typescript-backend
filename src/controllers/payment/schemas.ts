import { z } from "zod";
import { DECIMAL_RGX, PHONE_NUMBER_RGX } from "../../lib/util";

export const payoutSchema = z.object({
    merchant_email: z.string().email("Email validation failed. Please check and enter proper value for mail"),
    payout_date: z.string({ required_error: "Mandatory Parameter payout_date can not empty" }),
})

export const refundSchema = z.object({
    txnid: z.string({ required_error: "Mandatory Parameter txnid (Transaction ID) can not empty" }),
    merchant_email: z.string().email("Mandatory Parameter email can not empty"),
    phone: z.string().regex(PHONE_NUMBER_RGX, "Mandatory Parameter Phone can not be empty and must be valid"),
    amount: z.string().regex(DECIMAL_RGX, "Mandatory Parameter amount can not empty and must be in decimal"),
    refund_amount: z.string().regex(DECIMAL_RGX, "Mandatory Parameter  refund amount can not empty and must be in decimal"),
})

export const transactionDateSchema = z.object({
    merchant_email: z.string().email("Email validation failed. Please check and enter proper value for mail"),
    transaction_date: z.string({ required_error: "Mandatory Parameter transaction_date can not empty" }),
});

export const transactionSchema = z.object({
    phone: z.string().length(10, "Mandatory Parameter Phone can not empty and must contain 10 digits"),
    txnid: z.string({ required_error: "Mandatory Parameter txnid can not empty" }),
    amount: z.string({ required_error: "Mandatory Parameter amount can not empty" })
        .regex(DECIMAL_RGX, "Mandatory Parameter must be in decimal"),
    email: z.string().email("Mandatory Parameter email can not empty"),
});
