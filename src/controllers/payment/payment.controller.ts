import { Request, Response } from "express";
import { PaymentData, PaymentResponseData } from "./types";
import { axiosCall, checkReverseHash, createPaymentForm, generateHash, generatePayoutHash, generateRefundHash, generateTransactionDateHash, generateTransactionHash, getPaymentURL, getQueryURL, validatePaymentData } from "./utils";
import { config } from "./config";
import { payoutSchema, refundSchema, transactionDateSchema, transactionSchema } from "./schemas";
import { ZodError } from "zod";

export default class PaymentController {

    static async initiatePayment(req: Request, res: Response) {
        try {
            const data: PaymentData = req.body;

            const validationError = validatePaymentData(data);

            if (validationError) {
                return res.status(400).json({ success: false, message: validationError });
            }

            generateHash(data, config);

            const paymentUrl = getPaymentURL(config.env);
            const callUrl = `${paymentUrl}/payment/initiateLink`;

            const formData = createPaymentForm(data, config);
            const easeBuzzResponse = await axiosCall(callUrl, formData);

            if (!easeBuzzResponse.status) {
                return res.status(403).json({ success: false, message: "Payment Gateway Error" });
            }

            const accessKey = easeBuzzResponse.data;

            if (config.enable_iframe == 0) {
                const url = `${paymentUrl}pay/${accessKey}`;

                return res.redirect(url);
            } 

            return res.status(200).json({
                'key': config.key,
                'access_key': accessKey,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }

    static async payout(req: Request, res: Response) {
        try {
            const data = payoutSchema.parse(req.body);

            const hash = generatePayoutHash(data, config);

            const formData = {
                merchant_key: config.key,
                ...data,
                hash
            };

            const baseUrl = getQueryURL(config.env);

            if(baseUrl) {
                const callUrl = `${baseUrl}payout/v1/retrieve`;

                const easeBuzzResponse = await axiosCall(callUrl, formData);

                if (!easeBuzzResponse.status) {
                    return res.status(403).json({ success: false, message: "Payment Gateway Error" });
                }

                return res.status(200).json({ success: true, data: easeBuzzResponse.data });
            }

            return res.status(400).send({ success: false, message: "Environment not supported"});
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: e.message,
                });
            }
            
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }

    static async refund(req: Request, res: Response) {
        try {
            const data = refundSchema.parse(req.body);
            
            const hash = generateRefundHash(data, config);

            const formData = {
                key: config.key,
                ...data,
                hash,
            };

            const baseUrl = getQueryURL(config.env);

            if(baseUrl) {
                const callUrl = `${baseUrl}transaction/v1/refund`;

                const easeBuzzResponse = await axiosCall(callUrl, formData);

                if (!easeBuzzResponse.status) {
                    return res.status(403).json({ success: false, message: "Payment Gateway Error" });
                }

                return res.status(200).json({ success: true, data: easeBuzzResponse.data });
            }

            return res.status(400).send({ success: false, message: "Environment not supported"});
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: e.message,
                });
            }
            
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }

    static async transactionDate(req: Request, res: Response) {
        try {
            const data = transactionDateSchema.parse(req.body);
            
            const hash = generateTransactionDateHash(data, config);

            const formData = {
                merchant_key: config.key,
                ...data,
                hash,
            };

            const baseUrl = getQueryURL(config.env);

            if(baseUrl) {
                const callUrl = `${baseUrl}transaction/v1/retrieve/date`;

                const easeBuzzResponse = await axiosCall(callUrl, formData);

                if (!easeBuzzResponse.status) {
                    return res.status(403).json({ success: false, message: "Payment Gateway Error" });
                }

                return res.status(200).json({ success: true, data: easeBuzzResponse.data });
            }

            return res.status(400).send({ success: false, message: "Environment not supported"});
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: e.message,
                });
            }
            
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }

    static async transaction(req: Request, res: Response) {
        try {
            const data = transactionSchema.parse(req.body);
            
            const hash = generateTransactionHash(data, config);

            const formData = {
                key: config.key,
                ...data,
                hash,
            };

            const baseUrl = getQueryURL(config.env);

            if(baseUrl) {
                const callUrl = `${baseUrl}transaction/v1/retrieve`;

                const easeBuzzResponse = await axiosCall(callUrl, formData);

                if (!easeBuzzResponse.status) {
                    return res.status(403).json({ success: false, message: "Payment Gateway Error" });
                }

                return res.status(200).json({ success: true, data: easeBuzzResponse.data });
            }

            return res.status(400).send({ success: false, message: "Environment not supported"});
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: e.message,
                });
            }
            
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }

    static async response(req: Request, res: Response) {
        try {
            const data: PaymentResponseData = req.body;
            
            if (checkReverseHash(data, config)) {
                return res.send(req.body);
            }

            return res.send('false, check the hash value ');
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: e.message,
                });
            }
            
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }

}
