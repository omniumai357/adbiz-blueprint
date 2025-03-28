
import { useState, useEffect } from "react";
import { CustomerInfo } from "@/types/checkout";

/**
 * Hook for managing customer information and payment method state
 * 
 * Extracted from useCheckout to improve modularity and maintainability
 * 
 * @returns Object containing customer info and payment method state
 */
export function useCheckoutState() {
  // Initialize customer info state
  const [customerInfo, setCustomerInfo] = useState<Partial<CustomerInfo>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    invoiceDeliveryMethod: "email"
  });
  
  // Initialize payment method state
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal">("credit-card");
  
  return {
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod
  };
}
