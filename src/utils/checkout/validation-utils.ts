
import { CustomerInfo } from "@/types/checkout";

/**
 * Validates customer information for checkout
 * 
 * @param customerInfo Customer information to validate
 * @returns Object containing validation result and error message
 */
export function validateCustomerInfo(customerInfo: CustomerInfo): { isValid: boolean; error?: string } {
  if (!customerInfo.firstName || customerInfo.firstName.trim().length < 2) {
    return { isValid: false, error: "First name is required" };
  }
  
  if (!customerInfo.lastName || customerInfo.lastName.trim().length < 2) {
    return { isValid: false, error: "Last name is required" };
  }
  
  if (!customerInfo.email || !isValidEmail(customerInfo.email)) {
    return { isValid: false, error: "Valid email is required" };
  }
  
  if (customerInfo.invoiceDeliveryMethod === 'sms' || customerInfo.invoiceDeliveryMethod === 'both') {
    if (!customerInfo.phone || customerInfo.phone.trim().length < 5) {
      return { isValid: false, error: "Phone number is required for SMS delivery" };
    }
  }
  
  return { isValid: true };
}

/**
 * Validates an email address
 * 
 * @param email Email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number
 * 
 * @param phone Phone number to validate
 * @returns Whether the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  // Basic validation - at least 10 digits
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10;
}
