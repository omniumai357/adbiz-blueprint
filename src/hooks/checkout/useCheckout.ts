
import { useState, useEffect } from "react";
import { useOrderDetails } from "./useOrderDetails";
import { useCheckoutState } from "./useCheckoutState";
import { useCheckoutActions } from "./useCheckoutActions";
import { useCheckoutDiscounts } from "./useCheckoutDiscounts";
import { useCheckoutAddOns } from "./useCheckoutAddOns";
import { useCheckoutTotals } from "./useCheckoutTotals";
import { useProfile } from "@/hooks/data/useProfile";

/**
 * Main checkout hook that orchestrates the entire checkout flow.
 * This consolidates multiple smaller hooks to provide a unified API
 * for the checkout page.
 */
export function useCheckout() {
  // Use order details hook for package information
  const orderDetails = useOrderDetails();
  const {
    userId,
    packageName,
    packagePrice,
    packageDetails,
    handleOrderSuccess: handleBaseOrderSuccess
  } = orderDetails;

  // Use profile data if available
  const { profile } = useProfile(userId);
  
  // Use customer and payment state management
  const checkoutState = useCheckoutState();
  const { customerInfo, setCustomerInfo, paymentMethod, setPaymentMethod } = checkoutState;
  
  // Pre-fill customer info with profile data if available
  useEffect(() => {
    if (profile) {
      setCustomerInfo({
        userId: profile.id,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        company: profile.company || "",
        email: profile.email || "",
        invoiceDeliveryMethod: "email"
      });
    }
  }, [profile, setCustomerInfo]);

  // Use add-ons management
  const addOns = useCheckoutAddOns();
  
  // Track total discount amount for calculations
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  
  // Calculate totals based on package, add-ons, and discounts
  const totals = useCheckoutTotals({
    packagePrice,
    selectedAddOns: addOns.selectedItems,
    totalDiscountAmount
  });
  
  // Use discounts management, passing the current subtotal
  const discounts = useCheckoutDiscounts(
    userId,
    totals.subtotal,
    addOns.total
  );
  
  // Update total discount amount when any discount changes
  useEffect(() => {
    const newTotalDiscount = discounts.getTotalDiscount();
    setTotalDiscountAmount(newTotalDiscount);
  }, [
    discounts.bundle.amount,
    discounts.tiered.amount,
    discounts.loyalty.amount,
    discounts.offers.amount,
    discounts.coupons.amount,
    discounts.rewards.amount
  ]);
  
  // Update loyalty bonus and coupon discount when subtotal changes
  useEffect(() => {
    discounts.loyalty.updateBonus(totals.subtotal);
    discounts.coupons.updateAmount(totals.subtotal);
  }, [totals.subtotal]);
  
  // Create combined order success handler
  const actions = useCheckoutActions({
    handleBaseOrderSuccess,
    handleOrderSuccessWithRewards: discounts.rewards.handleOrderSuccess
  });

  // We create a simplified API with optional nested objects to reduce prop drilling
  return {
    // Order details
    orderDetails,
    
    // Customer info
    customerInfo,
    setCustomerInfo,
    
    // Payment method
    paymentMethod,
    setPaymentMethod,
    
    // Add-ons
    addOns,
    
    // Discounts and offers
    discounts: {
      bundle: discounts.bundle,
      tiered: discounts.tiered,
      loyalty: {
        enabled: discounts.loyalty.enabled,
        toggle: discounts.loyalty.toggle,
        amount: discounts.loyalty.amount,
      },
      offers: discounts.offers,
      coupons: discounts.coupons,
      rewards: {
        applied: discounts.rewards.applied,
        applyReward: discounts.rewards.applyReward,
        amount: discounts.rewards.amount,
      },
      total: totalDiscountAmount,
    },
    
    // Totals
    totals,
    
    // Actions
    handleOrderSuccess: actions.handleOrderSuccess,
    
    // Loading state
    isLoading: false,
  };
}
