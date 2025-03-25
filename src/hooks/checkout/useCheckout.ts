
import { useState, useEffect } from "react";
import { useOrderDetails } from "./useOrderDetails";
import { useCheckoutData } from "./useCheckoutData";
import { usePaymentOptions } from "./usePaymentOptions";
import { useRewardsAndLoyalty } from "./useRewardsAndLoyalty";
import { useCouponHandling } from "./useCouponHandling";
import { useDiscountState } from "./useDiscountState";
import { useCheckoutCalculations } from "./useCheckoutCalculations";
import { CustomerInfo } from "@/types/checkout";

/**
 * Main checkout hook that orchestrates the entire checkout flow.
 * This consolidates multiple smaller hooks to provide a unified API
 * for the checkout page.
 */
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

  // Use the consolidated hook for add-ons and customer info
  const {
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns,
    addOnsTotal,
    customerInfo,
    setCustomerInfo: setBaseCustomerInfo
  } = useCheckoutData({ userId, profile });

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

  // These calculations are now handled by useCheckoutCalculations
  const {
    subtotal,
    bundleDiscountAmount,
    tieredDiscountAmount,
    offerDiscountAmount,
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
  }, [subtotal, updateLoyaltyBonus, updateCouponDiscountAmount]);

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
