
import { useState, useCallback } from 'react';
import { CustomerInfo } from '@/types/checkout';
import { isValidEmail, isValidPhoneNumber } from '@/lib/utils/validation-utils';
import { toast } from 'sonner';

/**
 * Hook for validating checkout form data with improved error handling
 * Provides validation logic for customer information and checkout submission
 */
export function useCheckoutValidation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validates customer information fields
   * 
   * @param customerInfo Customer information to validate
   * @returns Boolean indicating if the information is valid
   */
  const validateCustomerInfo = useCallback((customerInfo: Partial<CustomerInfo>): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!customerInfo.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!customerInfo.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!customerInfo.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Conditional validation for phone based on delivery method
    if ((customerInfo.invoiceDeliveryMethod === 'sms' || customerInfo.invoiceDeliveryMethod === 'both') 
        && customerInfo.phone) {
      if (!isValidPhoneNumber(customerInfo.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    
    // If there are errors, show a toast with the first error
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error("Validation Error", {
        description: firstError
      });
      return false;
    }
    
    return true;
  }, []);
  
  /**
   * Validates the entire checkout before submission
   * 
   * @param customerInfo Customer information to validate
   * @returns Boolean indicating if submission is valid
   */
  const validateCheckoutSubmission = useCallback((customerInfo: Partial<CustomerInfo>): boolean => {
    // First validate customer info
    const isCustomerInfoValid = validateCustomerInfo(customerInfo);
    
    if (!isCustomerInfoValid) {
      return false;
    }
    
    // Additional checkout validations can be added here
    
    return true;
  }, [validateCustomerInfo]);

  return {
    errors,
    isSubmitting,
    setIsSubmitting,
    validateCustomerInfo,
    validateCheckoutSubmission
  };
}
