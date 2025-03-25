
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
  const orderDetails = useOrderDetails();
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
  } = orderDetails;

  // Use the consolidated hook for add-ons and customer info
  const checkoutData = useCheckoutData({ userId, profile });
  const {
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns,
    addOnsTotal,
    customerInfo,
    setCustomerInfo: setBaseCustomerInfo
  } = checkoutData;

  const { paymentMethod, setPaymentMethod } = usePaymentOptions();

  const rewardsAndLoyalty = useRewardsAndLoyalty(userId, 0);
  const {
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle,
    updateLoyaltyBonus,
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    handleOrderSuccessWithRewards
  } = rewardsAndLoyalty;

  const couponHandling = useCouponHandling();
  const {
    appliedCoupon,
    isCheckingCoupon,
    couponDiscountAmount,
    applyCoupon,
    removeCoupon,
    updateCouponDiscountAmount,
  } = couponHandling;

  const discountState = useDiscountState();
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
  } = discountState;

  // These calculations are now handled by useCheckoutCalculations
  const calculations = useCheckoutCalculations({
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
  
  const {
    subtotal,
    bundleDiscountAmount,
    tieredDiscountAmount,
    offerDiscountAmount,
    milestoneRewardAmount,
    totalDiscountAmount,
    total
  } = calculations;

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

  // We create a simplified API with optional nested objects to reduce prop drilling
  return {
    // Order details
    orderDetails: {
      showDownloadOptions,
      orderId,
      invoiceNumber,
      isGeneratingInvoice,
      userId,
      packageName,
      packagePrice,
      packageDetails,
      isProfileLoading,
    },
    
    // Customer info
    customerInfo,
    setCustomerInfo,
    
    // Payment method
    paymentMethod,
    setPaymentMethod,
    
    // Add-ons
    addOns: {
      available: availableAddOns,
      selected: selectedAddOnIds,
      selectedItems: selectedAddOns,
      toggle: handleAddOnToggle,
      total: addOnsTotal,
    },
    
    // Discounts and offers
    discounts: {
      bundle: {
        info: bundleDiscount,
        applicable: isDiscountApplicable,
        amount: bundleDiscountAmount,
      },
      tiered: {
        info: appliedTier,
        isFirstPurchase,
        amount: tieredDiscountAmount,
      },
      loyalty: {
        enabled: isLoyaltyProgramEnabled,
        toggle: handleLoyaltyProgramToggle,
        amount: loyaltyBonusAmount,
      },
      offers: {
        active: activeOffers,
        available: availableOffer,
        amount: offerDiscountAmount,
      },
      coupons: {
        personal: personalizedCoupon,
        applied: appliedCoupon,
        amount: couponDiscountAmount,
        isChecking: isCheckingCoupon,
        apply: applyCoupon,
        remove: removeCoupon,
      },
      rewards: {
        applied: appliedMilestoneReward,
        applyReward: handleMilestoneRewardApplied,
        amount: milestoneRewardAmount,
      },
      total: totalDiscountAmount,
    },
    
    // Totals
    totals: {
      subtotal,
      total,
    },
    
    // Actions
    handleOrderSuccess,
    
    // Loading state
    isLoading: false,
  };
}
