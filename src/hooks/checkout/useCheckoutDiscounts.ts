
import { useState, useEffect } from "react";
import { useDiscount } from "./useDiscount";
import { useCoupons } from "./useCoupons";
import { useLimitedTimeOffers } from "./useLimitedTimeOffers";
import { useRewardsAndLoyalty } from "./useRewardsAndLoyalty";

/**
 * Hook for managing all discount-related functionality in the checkout process
 * 
 * Extracted from useCheckout to improve modularity and maintainability
 * 
 * @param userId The current user's ID
 * @param subtotal The current order subtotal
 * @param addOnsTotal The total price of selected add-ons
 * @returns Object containing all discount-related state and handlers
 */
export function useCheckoutDiscounts(
  userId: string | undefined | null,
  subtotal: number,
  addOnsTotal: number
) {
  // Track total discount amount for calculations
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  
  // Use the bundle and tiered discount hook
  const bundleAndTierDiscounts = useDiscount(subtotal, addOnsTotal, userId || null);
  
  // Use the coupons hook
  const couponDiscounts = useCoupons(userId || null, subtotal);
  
  // Use the limited time offers hook
  const offers = useLimitedTimeOffers(subtotal);
  
  // Use the rewards and loyalty hook
  const rewardsAndLoyalty = useRewardsAndLoyalty(userId, subtotal);
  
  // Calculate total discount from all sources
  const getTotalDiscount = () => {
    return (
      bundleAndTierDiscounts.bundleDiscountAmount +
      bundleAndTierDiscounts.tieredDiscountAmount +
      rewardsAndLoyalty.loyaltyBonusAmount +
      offers.offerDiscountAmount +
      couponDiscounts.couponDiscountAmount +
      (rewardsAndLoyalty.appliedMilestoneReward ? 
        calculateMilestoneRewardAmount(rewardsAndLoyalty.appliedMilestoneReward) : 0)
    );
  };
  
  // Helper function to calculate milestone reward amount
  const calculateMilestoneRewardAmount = (reward: any) => {
    if (!reward || !reward.reward_type) return 0;
    
    if (reward.reward_type === 'percentage' && reward.reward_value) {
      return subtotal * (reward.reward_value / 100);
    }
    
    if (reward.reward_type === 'fixed' && reward.reward_value) {
      return reward.reward_value;
    }
    
    return 0;
  };
  
  // Update total discount amount when any discount changes
  useEffect(() => {
    const newTotalDiscount = getTotalDiscount();
    setTotalDiscountAmount(newTotalDiscount);
  }, [
    bundleAndTierDiscounts.bundleDiscountAmount,
    bundleAndTierDiscounts.tieredDiscountAmount,
    rewardsAndLoyalty.loyaltyBonusAmount,
    offers.offerDiscountAmount,
    couponDiscounts.couponDiscountAmount,
    rewardsAndLoyalty.appliedMilestoneReward
  ]);
  
  // Update loyalty bonus and coupon discount when subtotal changes
  useEffect(() => {
    rewardsAndLoyalty.updateLoyaltyBonus(subtotal);
    // Update coupon amount if there's an applied coupon
    if (couponDiscounts.appliedCoupon) {
      couponDiscounts.updateAmount(subtotal);
    }
  }, [subtotal]);
  
  return {
    // Bundle discount
    bundle: {
      info: bundleAndTierDiscounts.bundleDiscount,
      applicable: bundleAndTierDiscounts.isDiscountApplicable,
      amount: bundleAndTierDiscounts.bundleDiscountAmount,
    },
    
    // Tiered discount
    tiered: {
      info: bundleAndTierDiscounts.appliedTier,
      isFirstPurchase: bundleAndTierDiscounts.isFirstPurchase,
      amount: bundleAndTierDiscounts.tieredDiscountAmount,
    },
    
    // Loyalty program
    loyalty: {
      enabled: rewardsAndLoyalty.isLoyaltyProgramEnabled,
      toggle: rewardsAndLoyalty.handleLoyaltyProgramToggle,
      amount: rewardsAndLoyalty.loyaltyBonusAmount,
      updateBonus: rewardsAndLoyalty.updateLoyaltyBonus,
    },
    
    // Limited time offers
    offers: {
      active: offers.activeOffers,
      available: offers.availableOffer,
      amount: offers.offerDiscountAmount,
    },
    
    // Coupons
    coupons: {
      personal: couponDiscounts.personalizedCoupon,
      applied: couponDiscounts.appliedCoupon,
      amount: couponDiscounts.couponDiscountAmount,
      isChecking: couponDiscounts.isCheckingCoupon,
      apply: couponDiscounts.applyCoupon,
      remove: couponDiscounts.removeCoupon,
      updateAmount: couponDiscounts.updateAmount,
    },
    
    // Milestone rewards
    rewards: {
      applied: rewardsAndLoyalty.appliedMilestoneReward,
      applyReward: rewardsAndLoyalty.handleMilestoneRewardApplied,
      amount: rewardsAndLoyalty.appliedMilestoneReward ? 
        calculateMilestoneRewardAmount(rewardsAndLoyalty.appliedMilestoneReward) : 0,
      handleOrderSuccess: rewardsAndLoyalty.handleOrderSuccessWithRewards,
    },
    
    // Total discount amount
    total: totalDiscountAmount,
    
    // Helper functions
    getTotalDiscount,
  };
}
