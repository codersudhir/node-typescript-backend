export const GSTIN_RGX = /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[CZ]{1}[0-9a-zA-Z]{1}$|^[0-9]{4}[a-zA-Z]{3}[0-9]{5}[uUnN]{2}[0-9a-zA-Z]{1}$/;

const EMAIL_RGX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const PHONE_NUMBER_RGX = /^(\+\d{1,3})?(\d{10})$/;

export const DECIMAL_RGX = /^-?\d+\.\d{2}$/;

export const validateEmail = (email: string): boolean => EMAIL_RGX.test(email);

export const validatePhone = (phone: string): boolean => PHONE_NUMBER_RGX.test(phone);

export const validateGSTIN = (gstin: string) => {
  if(!gstin) {
    return false;
  }

  return GSTIN_RGX.test(gstin);
};

export function generateOTP() {
  const minOTPValue = 100000; // Minimum value for a 6-digit OTP
  const maxOTPValue = 999999; // Maximum value for a 6-digit OTP

  const otp = Math.floor(Math.random() * (maxOTPValue - minOTPValue + 1)) + minOTPValue;

  return otp.toString();
}

export function addMinutesToTime(date: Date, minutes: number) {
  const newTime = new Date(date.getTime() + minutes * 60000);
  return newTime;
}
