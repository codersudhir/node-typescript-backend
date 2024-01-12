import crypto from 'crypto';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Config, PaymentData, PaymentForm, PaymentResponseData, PayoutData, RefundData, TransactionData, TransactionDateData } from './types';
import { validateEmail, validatePhone } from "../../lib/util";
import { EASEBUZZ_DASHBOARD_ENDPOINT, EASEBUZZ_PROD_ENDPOINT, EASEBUZZ_TEST_ENDPOINT } from './constants';

export function generateHash(data: PaymentData, config: Config) {
    const hashString = [config.key, data.txnid, data.amount, data.productinfo, data.name, data.email, data.udf1, data.udf2, data.udf3, data.udf4, data.udf5, data.udf6, data.udf7, data.udf8, data.udf9, data.udf10, config.salt, ].join('|');
    const sha512 = crypto.createHash('sha512');
    sha512.update(hashString);
    data.hash = sha512.digest('hex');

    return data.hash;
}

export function generatePayoutHash(data: PayoutData, config: Config) {
    const hashString = [config.key, data.merchant_email, data.payout_date, config.salt].join('|');
    const sha512 = crypto.createHash('sha512');
    
    sha512.update(hashString);

    const payoutHashKey = sha512.digest('hex');
    
    return payoutHashKey;
}

export function generateRefundHash(data: RefundData, config: Config) {
    const hashString = [config.key, data.txnid, data.amount, data.refund_amount, data.merchant_email, data.phone, config.salt].join('|');

    const sha512 = crypto.createHash('sha512');
    
    sha512.update(hashString);

    const refundHashKey = sha512.digest('hex');
    
    return refundHashKey;
}

export function generateTransactionDateHash(data: TransactionDateData, config: Config) {
    const hashString = [config.key, data.merchant_email, data.transaction_date].join('|');

    const sha512 = crypto.createHash('sha512');
    
    sha512.update(hashString);

    data.hash = sha512.digest('hex');
    
    return data.hash;
}

export function generateTransactionHash(data: TransactionData, config: Config) {
    const hashString = [config.key, data.txnid, data.amount, data.email, data.phone, config.salt].join('|');

    const sha512 = crypto.createHash('sha512');
    
    sha512.update(hashString);

    const transactionHash = sha512.digest('hex');
    
    return transactionHash;
}

export function checkReverseHash(data: PaymentResponseData, config: Config) {
    const hashString = [config.salt, data.status, data.udf10, data.udf9, data.udf8, data.udf7, data.udf6, data.udf5, data.udf4, data.udf3, data.udf2, data.udf1, data.email, data.firstname, data.productinfo, data.amount, data.txnid, data.key].join('|');
    
    const sha512 = crypto.createHash('sha512');
    
    sha512.update(hashString);

    const hashKey = sha512.digest('hex');

    if (hashKey === data.hash) {
      return true;
    }
    
    return false;
}

export function getPaymentURL(env: 'test' | 'prod' | undefined): string {
    return env === 'prod' 
        ? EASEBUZZ_PROD_ENDPOINT 
        : EASEBUZZ_TEST_ENDPOINT;
}

export function getQueryURL(env: 'test' | 'prod' | undefined) {
    return env === 'prod' ? EASEBUZZ_DASHBOARD_ENDPOINT : "";
}

export function validatePaymentData(data: PaymentData): string | null {
  if (!data.name.trim()) {
    return "Mandatory Parameter name cannot be empty";
  }
  if (!(data.amount.trim()) || !parseFloat(data.amount)) {
    return "Mandatory Parameter amount cannot be empty and must be in decimal";
  }
  if (!data.txnid.trim()) {
    return "Merchant Transaction validation failed. Please enter a proper value for merchant txn";
  }
  if (!data.email.trim() || !validateEmail(data.email)) {
    return "Email validation failed. Please enter a proper value for email";
  }
  if (!data.phone.trim() || !validatePhone(data.phone)) {
    return "Phone validation failed. Please enter a proper value for phone";
  }
  if (!data.productinfo.trim()) {
    return "Mandatory Parameter Product info cannot be empty";
  }
  if (!data.surl.trim() || !data.furl.trim()) {
    return "Mandatory Parameter Surl/Furl cannot be empty";
  }
  return null;
}

export function createPaymentForm(data: PaymentData, config: Config): any {
  const form: PaymentForm = {
    'key': config.key,
    'txnid': data.txnid,
    'amount': data.amount,
    'email': data.email,
    'phone': data.phone,
    'firstname': data.name,
    'udf1': data.udf1,
    'udf2': data.udf2,
    'udf3': data.udf3,
    'udf4': data.udf4,
    'udf5': data.udf5,
    'hash': generateHash(data, config), // Calculate the hash here
    'productinfo': data.productinfo,
    'udf6': data.udf6,
    'udf7': data.udf7,
    'udf8': data.udf8,
    'udf9': data.udf9,
    'udf10': data.udf10,
    'furl': data.furl,
    'surl': data.surl,
  };

  if (data.unique_id) {
    form.unique_id = data.unique_id;
  }

  if (data.split_payments) {
    form.split_payments = data.split_payments;
  }

  if (data.sub_merchant_id) {
    form.sub_merchant_id = data.sub_merchant_id;
  }

  if (data.customer_authentication_id) {
    form.customer_authentication_id = data.customer_authentication_id;
  }

  return form;
}

export async function axiosCall(url: string, data: any, method: string = 'POST'): Promise<AxiosResponse> {
  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  };

  return await axios(config);
}
