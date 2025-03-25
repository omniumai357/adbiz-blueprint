
import { useState } from "react";
import { CustomerInfo } from "@/types/checkout";

/**
 * Hook to manage the core checkout state
 * This separates the state management from the business logic
 */
export function useCheckoutState() {
  // Customer info state
  const [customerInfo, setBaseCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    invoiceDeliveryMethod: "email"
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal">("credit-card");
  
  // Custom handler for customer info changes to maintain shape
  const setCustomerInfo = (info: CustomerInfo) => {
    setBaseCustomerInfo({
      firstName: info.firstName,
      lastName: info.lastName,
      company: info.company || "",
      email: info.email,
      phone: info.phone,
      website: info.website,
      invoiceDeliveryMethod: info.invoiceDeliveryMethod,
      userId: info.userId
    });
  };
  
  return {
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod
  };
}
