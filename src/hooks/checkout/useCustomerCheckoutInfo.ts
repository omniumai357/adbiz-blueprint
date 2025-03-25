
import { useState, useEffect } from "react";
import { CustomerInfo } from "@/types/checkout";

export function useCustomerCheckoutInfo(profile: any | null) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    invoiceDeliveryMethod: "email" // Added missing required property
  });

  // Pre-fill customer info with profile data if available
  useEffect(() => {
    if (profile) {
      setCustomerInfo({
        userId: profile.id,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        company: profile.company || "",
        email: "",
        invoiceDeliveryMethod: "email" // Added missing required property
      });
    }
  }, [profile]);

  return {
    customerInfo,
    setCustomerInfo
  };
}
