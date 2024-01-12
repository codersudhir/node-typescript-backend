import { PaymentData, PaymentResponseData } from "./types";
import { axiosCall, checkReverseHash, createPaymentForm, generateHash, generatePayoutHash, generateRefundHash, generateTransactionDateHash, generateTransactionHash, getPaymentURL, getQueryURL, validatePaymentData } from "./utils";
import { config } from "./config";
import { payoutSchema, refundSchema, transactionDateSchema, transactionSchema } from "./schemas";
import { ZodError, z } from "zod";

export default class PaymentService {

    static async initiatePayment(data: PaymentData) {
        try {
            const validationError = validatePaymentData(data);

            if (validationError) {
                throw new Error(validationError);
            }

            generateHash(data, config);

            const paymentUrl = getPaymentURL(config.env);
            const callUrl = `${paymentUrl}/payment/initiateLink`;

            const formData = createPaymentForm(data, config);
            const easeBuzzResponse = await axiosCall(callUrl, formData);

            if (!easeBuzzResponse.status) {
                throw new Error("Payment Gateway Error");
            }

            const accessKey = easeBuzzResponse.data;

            return {
                'success': true,
                'key': config.key,
                'access_key': accessKey,
            };
        } catch (e) {
            console.log(e);
            return {
                success: false,
                error: e
            };
        }
    }

    static async payout(requestData: z.infer<typeof payoutSchema>) {
        try {
            const data = payoutSchema.parse(requestData);

            const hash = generatePayoutHash(data, config);

            const formData = {
                merchant_key: config.key,
                ...data,
                hash
            };

            const baseUrl = getQueryURL(config.env);

            if(!baseUrl) {
                throw new Error("Environment not supported");
            }

            const callUrl = `${baseUrl}payout/v1/retrieve`;

            const easeBuzzResponse = await axiosCall(callUrl, formData);

            if (!easeBuzzResponse.status) {
                throw new Error("Payment Gateway Error" );
            }

            return { success: true, data: easeBuzzResponse.data };
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return {
                    success: false,
                    message: e.message,
                };
            }
            
            return { success: false, message: "Something went wrong" };
        }
    }

    static async refund(requestData: z.infer<typeof refundSchema>) {
        try {
            const data = refundSchema.parse(requestData);
            
            const hash = generateRefundHash(data, config);

            const formData = {
                key: config.key,
                ...data,
                hash,
            };

            const baseUrl = getQueryURL(config.env);

            if(!baseUrl) {
                return { success: false, message: "Environment not supported"};
            }

            const callUrl = `${baseUrl}transaction/v1/refund`;

            const easeBuzzResponse = await axiosCall(callUrl, formData);

            if (!easeBuzzResponse.status) {
                return { success: false, message: "Payment Gateway Error" };
            }

            return { success: true, data: easeBuzzResponse.data };
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return {
                    success: false,
                    message: e.message,
                };
            }
            
            return { success: false, message: "Something went wrong" };
        }
    }

    static async transactionDate(requestData: z.infer<typeof transactionDateSchema>) {
        try {
            const data = transactionDateSchema.parse(requestData);
            
            const hash = generateTransactionDateHash(data, config);

            const formData = {
                merchant_key: config.key,
                ...data,
                hash,
            };

            const baseUrl = getQueryURL(config.env);

            if(!baseUrl) {
                return { success: false, message: "Environment not supported"};
            }

            const callUrl = `${baseUrl}transaction/v1/retrieve/date`;

            const easeBuzzResponse = await axiosCall(callUrl, formData);

            if (!easeBuzzResponse.status) {
                return { success: false, message: "Payment Gateway Error" };
            }

            return { success: true, data: easeBuzzResponse.data };
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return {
                    success: false,
                    message: e.message,
                };
            }
            
            return { success: false, message: "Something went wrong" };
        }
    }

    static async transaction(requestData: z.infer<typeof transactionSchema>) {
        try {
            const data = transactionSchema.parse(requestData);
            
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
                    return { success: false, message: "Payment Gateway Error" };
                }

                return { success: true, data: easeBuzzResponse.data };
            }

            return { success: false, message: "Environment not supported"};
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return {
                    success: false,
                    message: e.message,
                };
            }
            
            return { success: false, message: "Something went wrong" };
        }
    }

    static async response(data: PaymentResponseData) {
        try {
            if (checkReverseHash(data, config)) {
                return {success: true, data };
            }

            return {success: false, error: "false, check the hash value"};
        } catch (e) {
            console.log(e);
            if(e instanceof ZodError) {
                return {
                    success: false,
                    message: e.message,
                };
            }
            
            return { success: false, message: "Something went wrong" }
        }
    }

}
