
import { useState, useEffect } from "react";
import { useOrderDetails } from "./useOrderDetails";
import { useAddOnSelection } from "./useAddOnSelection";
import { useCustomerCheckoutInfo } from "./useCustomerCheckoutInfo";
import { usePaymentOptions } from "./usePaymentOptions";
import { useRewardsAndLoyalty } from "./useRewardsAndLoyalty";
import { useCouponHandling } from "./useCouponHandling";
import { useDiscountState } from "./useDiscountState";
import { useCheckoutCalculations } from "./useCheckoutCalculations";
import { CustomerInfo } from "@/components/checkout/customer-info-form";

export function useCheckout() {
  // Use our specialized hooks
  const {
    showDownloadOptions,
    orderId,
    invoiceNumber,
    isGeneratingInvoice,
    userId,
    packageName,
    packagePrice,
    packageDetails,
    isProfileLoading,
    profile,
    handleOrderSuccess: handleBaseOrderSuccess
  } = useOrderDetails();

  const {
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns
  } = useAddOnSelection();

  const { customerInfo, setCustomerInfo: setBaseCustomerInfo } = useCustomerCheckoutInfo(profile);

  const { paymentMethod, setPaymentMethod } = usePaymentOptions();

  const {
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle,
    updateLoyaltyBonus,
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    handleOrderSuccessWithRewards
  } = useRewardsAndLoyalty(userId, 0);

  const {
    appliedCoupon,
    isCheckingCoupon,
    couponDiscountAmount,
    applyCoupon,
    removeCoupon,
    updateCouponDiscountAmount,
  } = useCouponHandling();

  const {
    bundleDiscount,
    isDiscountApplicable,
    appliedTier,
    isFirstPurchase,
    activeOffers,
    availableOffer,
    personalizedCoupon,
    setBundleDiscount,
    setIsDiscountApplicable,
    setAppliedTier,
    setIsFirstPurchase,
    setActiveOffers,
    setAvailableOffer,
    setPersonalizedCoupon
  } = useDiscountState();

  // These state variables should come from useDiscountState
  const [bundleDiscountAmount, setBundleDiscountAmount] = useState<number>(0);
  const [tieredDiscountAmount, setTieredDiscountAmount] = useState<number>(0);
  const [offerDiscountAmount, setOfferDiscountAmount] = useState<number>(0);
  
  // Use the calculations hook
  const {
    addOnsTotal,
    subtotal,
    milestoneRewardAmount,
    totalDiscountAmount,
    total
  } = useCheckoutCalculations({
    packagePrice,
    selectedAddOns,
    bundleDiscount,
    isDiscountApplicable,
    tieredDiscount: appliedTier,
    isFirstPurchase,
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    availableOffer,
    appliedCoupon,
    appliedMilestoneReward
  });

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

  // Update loyalty bonus whenever subtotal changes
  useEffect(() => {
    updateLoyaltyBonus(subtotal);
    updateCouponDiscountAmount(subtotal);
  }, [subtotal]);

  // Combined order success handler
  const handleOrderSuccess = async (orderId: string) => {
    // Call the base order success handler
    handleBaseOrderSuccess(orderId);
    
    // Award milestone points if applicable
    await handleOrderSuccessWithRewards(orderId, total);
  };

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
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns,
    bundleDiscount,
    isDiscountApplicable,
    appliedTier,
    isFirstPurchase,
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle,
    activeOffers,
    availableOffer,
    personalizedCoupon,
    appliedCoupon,
    couponDiscountAmount,
    isCheckingCoupon,
    applyCoupon,
    removeCoupon,
    isLoading: false,
    addOnsTotal,
    subtotal,
    bundleDiscountAmount,
    tieredDiscountAmount,
    offerDiscountAmount,
    milestoneRewardAmount,
    totalDiscountAmount,
    total,
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
  };
}
