
import { useState, useEffect } from "react";
import { CustomerInfo } from "@/components/checkout/customer-info-form";

export function useCustomerCheckoutInfo(profile: any | null) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
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
      });
    }
  }, [profile]);

  return {
    customerInfo,
    setCustomerInfo
  };
}
