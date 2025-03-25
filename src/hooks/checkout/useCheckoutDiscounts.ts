
import { useDiscount } from "./useDiscount";
import { useLimitedTimeOffers } from "./useLimitedTimeOffers";
import { useCouponHandling } from "./useCouponHandling";
import { useRewardsAndLoyalty } from "./useRewardsAndLoyalty";

/**
 * Hook that consolidates all discount-related logic for the checkout
 * 
 * @param userId Current user ID
 * @param subtotal Current subtotal before discounts
 * @param addOnsTotal Total price of selected add-ons
 * @returns Object containing all discount state and handlers
 */
export function useCheckoutDiscounts(
  userId: string | undefined | null,
  subtotal: number,
  addOnsTotal: number
) {
  // Handle rewards and loyalty program
  const rewardsAndLoyalty = useRewardsAndLoyalty(userId, subtotal);
  const {
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle,
    updateLoyaltyBonus,
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    handleOrderSuccessWithRewards
  } = rewardsAndLoyalty;

  // Handle coupon application and validation
  const couponHandling = useCouponHandling();
  const {
    appliedCoupon,
    isCheckingCoupon,
    couponDiscountAmount,
    applyCoupon,
    removeCoupon,
    updateCouponDiscountAmount,
  } = couponHandling;

  // Use the discount hook
  const discount = useDiscount(subtotal, addOnsTotal, userId || null);
  const {
    bundleDiscount,
    isDiscountApplicable,
    bundleDiscountAmount,
    appliedTier,
    tieredDiscountAmount,
    isFirstPurchase,
    totalDiscountAmount: baseDiscountAmount
  } = discount;

  // Handle limited time offers
  const limitedTimeOffers = useLimitedTimeOffers(subtotal);
  const {
    activeOffers,
    availableOffer,
    offerDiscountAmount
  } = limitedTimeOffers;

  return {
    // Bundle discounts
    bundle: {
      info: bundleDiscount,
      applicable: isDiscountApplicable,
      amount: bundleDiscountAmount,
    },
    
    // Tiered discounts
    tiered: {
      info: appliedTier,
      isFirstPurchase,
      amount: tieredDiscountAmount,
    },
    
    // Loyalty program
    loyalty: {
      enabled: isLoyaltyProgramEnabled,
      toggle: handleLoyaltyProgramToggle,
      amount: loyaltyBonusAmount,
      updateBonus: updateLoyaltyBonus
    },
    
    // Limited time offers
    offers: {
      active: activeOffers,
      available: availableOffer,
      amount: offerDiscountAmount,
    },
    
    // Coupon handling
    coupons: {
      applied: appliedCoupon,
      amount: couponDiscountAmount,
      isChecking: isCheckingCoupon,
      apply: applyCoupon,
      remove: removeCoupon,
      updateAmount: updateCouponDiscountAmount,
    },
    
    // Milestone rewards
    rewards: {
      applied: appliedMilestoneReward,
      applyReward: handleMilestoneRewardApplied,
      amount: appliedMilestoneReward ? tieredDiscountAmount : 0,
      handleOrderSuccess: handleOrderSuccessWithRewards
    },
    
    // Calculate total discount including all types
    getTotalDiscount: () => {
      const loyaltyAmount = isLoyaltyProgramEnabled ? loyaltyBonusAmount || 0 : 0;
      const milestoneAmount = appliedMilestoneReward ? tieredDiscountAmount : 0;
      
      return bundleDiscountAmount +
        tieredDiscountAmount +
        loyaltyAmount +
        offerDiscountAmount +
        couponDiscountAmount +
        milestoneAmount;
    }
  };
}
