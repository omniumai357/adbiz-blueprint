
import { useState, useEffect } from "react";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { useProfile } from "@/hooks/data/useProfile";

export function useCustomerInfo(userId: string | null) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    invoiceDeliveryMethod: "email"
  });

  // Get user profile data if they're logged in
  const { profile, isLoading: isProfileLoading } = useProfile(userId);

  // Pre-fill customer info with profile data if available
  useEffect(() => {
    if (profile && !customerInfo.firstName) {
      setCustomerInfo(prevInfo => ({
        ...prevInfo,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        company: profile.company || "",
        userId: profile.id
      }));
    }
  }, [profile, customerInfo.firstName]);

  return {
    customerInfo,
    setCustomerInfo,
    isProfileLoading
  };
}
