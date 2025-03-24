
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { useProfile } from "@/hooks/data/useProfile";
import { useAddOns, availableAddOns } from "./useAddOns";
import { useDiscount, bundleDiscount } from "./useDiscount";
import { useOrderProcessing } from "./useOrderProcessing";
import { PaymentMethod } from "./types";

export function useCheckout() {
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    invoiceDeliveryMethod: "email"
  });
  const [userId, setUserId] = useState<string | null>(null);
  
  const packageName = location.state?.packageName || "Standard Package";
  const packagePrice = location.state?.packagePrice || 199;
  const packageDetails = location.state?.packageDetails || { 
    id: "default-package", 
    title: packageName,
    price: packagePrice,
    description: "Standard package with basic features",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  };

  // Get user profile data if they're logged in
  const { profile, isLoading: isProfileLoading } = useProfile(userId);

  // Use add-ons hook
  const {
    selectedAddOnIds,
    selectedAddOns,
    addOnsTotal,
    handleAddOnToggle
  } = useAddOns(bundleDiscount.threshold);
  
  // Calculate the subtotal (package + add-ons)
  const subtotal = packagePrice + addOnsTotal;
  
  // Use discount hook
  const {
    isDiscountApplicable,
    discountAmount
  } = useDiscount(subtotal, addOnsTotal);
  
  // Calculate the final total with discount
  const total = subtotal - discountAmount;

  // Use order processing hook
  const {
    showDownloadOptions,
    orderId,
    invoiceNumber,
    isGeneratingInvoice,
    handleOrderSuccess
  } = useOrderProcessing({
    userId,
    packageName,
    packageDetails,
    selectedAddOns,
    isDiscountApplicable,
    bundleDiscount,
    total,
    customerInfo  // Pass customerInfo to useOrderProcessing
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    checkUser();
  }, []);

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
      }));
    }
  }, [profile]);

  return {
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod,
    showDownloadOptions,
    orderId,
    invoiceNumber,
    isGeneratingInvoice,
    userId,
    packageName,
    packagePrice,
    packageDetails,
    isProfileLoading,
    handleOrderSuccess,
    // Add-ons related
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns,
    // Bundle discount related
    bundleDiscount,
    isDiscountApplicable,
    // Calculated values
    subtotal,
    discountAmount,
    total
  };
}
