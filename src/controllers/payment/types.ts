import { z } from "zod";
import { payoutSchema, refundSchema, transactionDateSchema, transactionSchema } from "./schemas";

export interface Config {
    key: string | undefined; // Your API key
    env: 'test' | 'prod' | undefined; // Environment ('test' or 'prod')
    salt: string | undefined; // Your API salt
    enable_iframe: number | undefined; // Flag to determine if iframe is enabled (0 or 1)
}

export interface PaymentData {
  unique_id: string | null;
  split_payments: string | null;
  sub_merchant_id: string | null;
  customer_authentication_id: string | null;
  name: string;
  amount: string;
  txnid: string;
  email: string;
  phone: string;
  productinfo: string;
  surl: string;
  furl: string;
  udf1: string | null;
  udf2: string | null;
  udf3: string | null;
  udf4: string | null;
  udf5: string | null;
  udf6: string | null;
  udf7: string | null;
  udf8: string | null;
  udf9: string | null;
  udf10: string | null;
  hash?: string; // Optional hash property
}

export interface PaymentForm {
  key: string | undefined;
  txnid: string;
  amount: string;
  email: string;
  phone: string;
  firstname: string;
  udf1: string | null;
  udf2: string | null;
  udf3: string | null;
  udf4: string | null;
  udf5: string | null;
  hash: string;
  productinfo: string;
  udf6: string | null;
  udf7: string | null;
  udf8: string | null;
  udf9: string | null;
  udf10: string | null;
  furl: string;
  surl: string;
  unique_id?: string;
  split_payments?: string;
  sub_merchant_id?: string;
  customer_authentication_id?: string;
}

export interface PaymentResponseData extends PaymentData {
    status: string,
    firstname: string,
    key: string,
}

export type PayoutData = z.infer<typeof payoutSchema>;

export type RefundData = z.infer<typeof refundSchema>;

export type TransactionDateData = z.infer<typeof transactionDateSchema> & {
    hash?: string;
};

export type TransactionData = z.infer<typeof transactionSchema>;
