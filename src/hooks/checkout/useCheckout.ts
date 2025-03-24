
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { useProfile } from "@/hooks/data/useProfile";
import { useAddOns, availableAddOns } from "./useAddOns";
import { useDiscount, bundleDiscount, discountTiers } from "./useDiscount";
import { useOrderProcessing } from "./useOrderProcessing";
import { useCoupons } from "./useCoupons";
import { useLimitedTimeOffers } from "./useLimitedTimeOffers";
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
  const [isLoyaltyProgramEnabled, setIsLoyaltyProgramEnabled] = useState<boolean>(false);
  const [loyaltyBonusAmount, setLoyaltyBonusAmount] = useState<number>(0);
  
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
  
  // Use discount hook with user ID for first-purchase detection
  const {
    isDiscountApplicable,
    bundleDiscountAmount,
    appliedTier,
    tieredDiscountAmount,
    isFirstPurchase,
    firstPurchaseBonus,
    totalDiscountAmount: baseDiscountAmount,
    isLoading: isDiscountLoading
  } = useDiscount(subtotal, addOnsTotal, userId);

  // Use coupons hook for personalized and limited-time offers
  const {
    personalizedCoupon,
    appliedCoupon,
    couponDiscountAmount,
    isCheckingCoupon,
    applyCoupon,
    removeCoupon
  } = useCoupons(userId, subtotal);

  // Use limited time offers hook
  const {
    activeOffers,
    availableOffer,
    offerDiscountAmount,
    isLoading: isOffersLoading
  } = useLimitedTimeOffers(subtotal);

  // Calculate loyalty bonus (5% of subtotal if loyalty program is enabled)
  useEffect(() => {
    if (isLoyaltyProgramEnabled && userId) {
      setLoyaltyBonusAmount(subtotal * 0.05);
    } else {
      setLoyaltyBonusAmount(0);
    }
  }, [isLoyaltyProgramEnabled, subtotal, userId]);
  
  // Handle loyalty program toggle
  const handleLoyaltyProgramToggle = () => {
    if (userId) {
      setIsLoyaltyProgramEnabled(!isLoyaltyProgramEnabled);
    }
  };

  // Calculate total discount (base discounts + loyalty bonus + coupon + limited-time offer)
  const totalDiscountAmount = baseDiscountAmount + loyaltyBonusAmount + 
                              couponDiscountAmount + offerDiscountAmount;
  
  // Calculate the final total with all discounts
  const total = Math.max(0, subtotal - totalDiscountAmount);

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
    tieredDiscount: appliedTier,
    isFirstPurchase,
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    totalDiscountAmount,
    total,
    customerInfo
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
        userId: profile.id
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
    bundleDiscountAmount,
    // Tiered discount related
    discountTiers,
    appliedTier,
    isFirstPurchase,
    tieredDiscountAmount,
    firstPurchaseBonus,
    // Loyalty program related
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle,
    // Coupon related
    personalizedCoupon,
    appliedCoupon,
    couponDiscountAmount,
    isCheckingCoupon,
    applyCoupon,
    removeCoupon,
    // Limited-time offers related
    activeOffers,
    availableOffer,
    offerDiscountAmount,
    // Loading states
    isLoading: isProfileLoading || isDiscountLoading || isCheckingCoupon || isOffersLoading,
    // Calculated values
    subtotal,
    totalDiscountAmount,
    total
  };
}
