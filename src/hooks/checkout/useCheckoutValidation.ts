
import { useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { CustomerInfo } from "@/types/checkout";
import { validateCustomerInfo as validateCustomerInfoUtil } from "@/utils/checkout/validation-utils";

/**
 * Hook for validating checkout data
 * 
 * Provides validation utilities for customer information and checkout submission
 */
export function useCheckoutValidation() {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  /**
   * Validates customer information
   * @param customerInfo Customer information to validate
   * @returns Whether the customer information is valid
   */
  const validateCustomerInfo = (customerInfo: Partial<CustomerInfo>): boolean => {
    const result = validateCustomerInfoUtil(customerInfo as CustomerInfo);
    
    if (!result.isValid) {
      setValidationError(result.error);
      return false;
    }
    
    setValidationError(null);
    return true;
  };
  
  /**
   * Validates the checkout submission
   * @param customerInfo Customer information to validate
   * @returns Whether the checkout submission is valid
   */
  const validateCheckoutSubmission = (customerInfo: Partial<CustomerInfo>): boolean => {
    // First validate customer info
    if (!validateCustomerInfo(customerInfo)) {
      toast({
        title: "Missing or invalid information",
        description: validationError || "Please check your information and try again.",
        variant: "destructive",
      });
      return false;
    }
    
    // Additional validation could be added here
    
    return true;
  };
  
  return {
    validationError,
    isSubmitting,
    setIsSubmitting,
    validateCustomerInfo,
    validateCheckoutSubmission
  };
}
