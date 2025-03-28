
import { useState, useEffect } from "react";
import { CustomerInfo } from "@/types/checkout";
import { customerInfoSchema } from "@/schemas/checkout-validation";
import { useToast } from "@/hooks/ui/use-toast";

export function useCheckoutValidation() {
  const [customerInfoValid, setCustomerInfoValid] = useState(false);
  const [paymentFormValid, setPaymentFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Validate customer information
  const validateCustomerInfo = (customerInfo: Partial<CustomerInfo>): boolean => {
    try {
      // Use the zod schema to validate the customer info
      customerInfoSchema.parse(customerInfo);
      setCustomerInfoValid(true);
      return true;
    } catch (error) {
      setCustomerInfoValid(false);
      return false;
    }
  };
  
  // Set payment form validation state
  const setPaymentValidationState = (isValid: boolean) => {
    setPaymentFormValid(isValid);
  };
  
  // Check if all conditions are met for submission
  const canSubmit = () => {
    return customerInfoValid && paymentFormValid && !isSubmitting;
  };
  
  // Validate the entire checkout before submission
  const validateCheckoutSubmission = (customerInfo: Partial<CustomerInfo>): boolean => {
    if (!validateCustomerInfo(customerInfo)) {
      toast({
        title: "Missing information",
        description: "Please complete all required customer information fields.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!paymentFormValid) {
      toast({
        title: "Invalid payment details",
        description: "Please check your payment information and try again.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  return {
    customerInfoValid,
    paymentFormValid,
    isSubmitting,
    setIsSubmitting,
    validateCustomerInfo,
    setPaymentValidationState,
    validateCheckoutSubmission,
    canSubmit
  };
}
