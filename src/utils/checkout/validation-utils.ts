
import { CustomerInfo } from "@/types/checkout";
import { isValidEmail, isValidPhoneNumber } from "@/lib/utils/validation-utils";

/**
 * Validates customer information
 * 
 * @param customerInfo - The customer information to validate
 * @returns An object with validation result and error message if invalid
 */
export const validateCustomerInfo = (customerInfo: CustomerInfo): { isValid: boolean; error: string | null } => {
  // Check required fields
  if (!customerInfo.firstName || !customerInfo.firstName.trim()) {
    return { isValid: false, error: "First name is required" };
  }
  
  if (!customerInfo.lastName || !customerInfo.lastName.trim()) {
    return { isValid: false, error: "Last name is required" };
  }
  
  if (!customerInfo.email || !customerInfo.email.trim()) {
    return { isValid: false, error: "Email is required" };
  }
  
  // Validate email format
  if (!isValidEmail(customerInfo.email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  // Validate phone number if delivery method requires it
  if ((customerInfo.invoiceDeliveryMethod === 'sms' || customerInfo.invoiceDeliveryMethod === 'both') && 
      (!customerInfo.phone || !customerInfo.phone.trim())) {
    return { isValid: false, error: "Phone number is required for SMS delivery" };
  }
  
  // Validate phone number format if provided
  if (customerInfo.phone && !isValidPhoneNumber(customerInfo.phone)) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }
  
  return { isValid: true, error: null };
};
