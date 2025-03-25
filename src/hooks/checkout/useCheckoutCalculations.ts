
// Update the checkout calculations to include milestone rewards
import { useEffect, useState } from "react";
import { UserMilestone } from "../rewards/useMilestones";

/**
 * Hook for centralizing all price calculations in the checkout process.
 * This includes calculating subtotals, discounts, and final totals.
 * 
 * @param params Object containing all values needed for calculation
 * @returns Object containing calculated price values
 */
export function useCheckoutCalculations({
  packagePrice,
  selectedAddOns,
  bundleDiscount,
  isDiscountApplicable,
  tieredDiscount,
  isFirstPurchase,
  isLoyaltyProgramEnabled,
  loyaltyBonusAmount,
  availableOffer,
  appliedCoupon,
  appliedMilestoneReward
}: {
  packagePrice: number;
  selectedAddOns: any[];
  bundleDiscount?: any;
  isDiscountApplicable?: boolean;
  tieredDiscount?: any;
  isFirstPurchase?: boolean;
  isLoyaltyProgramEnabled?: boolean;
  loyaltyBonusAmount?: number;
  availableOffer?: any;
  appliedCoupon?: any;
  appliedMilestoneReward?: UserMilestone | null;
}) {
  const [addOnsTotal, setAddOnsTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [bundleDiscountAmount, setBundleDiscountAmount] = useState(0);
  const [tieredDiscountAmount, setTieredDiscountAmount] = useState(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  const [offerDiscountAmount, setOfferDiscountAmount] = useState(0);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [milestoneRewardAmount, setMilestoneRewardAmount] = useState(0);
  const [total, setTotal] = useState(0);

  // Calculate add-ons total
  useEffect(() => {
    const addOnsSum = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    setAddOnsTotal(addOnsSum);
  }, [selectedAddOns]);

  // Calculate subtotal (package + add-ons)
  useEffect(() => {
    setSubtotal(packagePrice + addOnsTotal);
  }, [packagePrice, addOnsTotal]);

  // Calculate bundle discount
  useEffect(() => {
    if (isDiscountApplicable && bundleDiscount) {
      if (bundleDiscount.discountType === "percentage") {
        setBundleDiscountAmount(
          (subtotal * bundleDiscount.discountValue) / 100
        );
      } else {
        setBundleDiscountAmount(bundleDiscount.discountValue);
      }
    } else {
      setBundleDiscountAmount(0);
    }
  }, [isDiscountApplicable, bundleDiscount, subtotal]);

  // Calculate tiered discount
  useEffect(() => {
    if (tieredDiscount) {
      let discount = 0;
      if (tieredDiscount.discountType === "percentage") {
        discount = (subtotal * tieredDiscount.discountAmount) / 100;
      } else {
        discount = tieredDiscount.discountAmount;
      }

      // Add first purchase bonus if applicable
      if (
        isFirstPurchase &&
        tieredDiscount.firstPurchaseBonus &&
        tieredDiscount.firstPurchaseBonus > 0
      ) {
        if (tieredDiscount.discountType === "percentage") {
          discount +=
            (subtotal * tieredDiscount.firstPurchaseBonus) / 100;
        } else {
          discount += tieredDiscount.firstPurchaseBonus;
        }
      }

      setTieredDiscountAmount(discount);
    } else {
      setTieredDiscountAmount(0);
    }
  }, [tieredDiscount, isFirstPurchase, subtotal]);

  // Calculate limited time offer discount
  useEffect(() => {
    if (availableOffer) {
      if (availableOffer.discountType === "percentage") {
        setOfferDiscountAmount(
          (subtotal * availableOffer.discountValue) / 100
        );
      } else {
        setOfferDiscountAmount(availableOffer.discountValue);
      }
    } else {
      setOfferDiscountAmount(0);
    }
  }, [availableOffer, subtotal]);

  // Calculate coupon discount
  useEffect(() => {
    if (appliedCoupon) {
      if (appliedCoupon.discount_percentage) {
        setCouponDiscountAmount(
          (subtotal * appliedCoupon.discount_percentage) / 100
        );
      } else if (appliedCoupon.discount_amount) {
        setCouponDiscountAmount(appliedCoupon.discount_amount);
      }
    } else {
      setCouponDiscountAmount(0);
    }
  }, [appliedCoupon, subtotal]);

  // Calculate milestone reward discount
  useEffect(() => {
    if (appliedMilestoneReward) {
      if (appliedMilestoneReward.reward_type === 'discount_percentage') {
        setMilestoneRewardAmount(
          (subtotal * appliedMilestoneReward.reward_value) / 100
        );
      } else {
        setMilestoneRewardAmount(Math.min(subtotal, appliedMilestoneReward.reward_value));
      }
    } else {
      setMilestoneRewardAmount(0);
    }
  }, [appliedMilestoneReward, subtotal]);

  // Calculate total discount and final total
  useEffect(() => {
    const loyaltyDiscount = isLoyaltyProgramEnabled ? loyaltyBonusAmount || 0 : 0;
    
    const totalDiscount =
      bundleDiscountAmount +
      tieredDiscountAmount +
      loyaltyDiscount +
      offerDiscountAmount +
      couponDiscountAmount +
      milestoneRewardAmount;
      
    setTotalDiscountAmount(totalDiscount);
    setTotal(Math.max(0, subtotal - totalDiscount));
  }, [
    subtotal,
    bundleDiscountAmount,
    tieredDiscountAmount,
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    offerDiscountAmount,
    couponDiscountAmount,
    milestoneRewardAmount
  ]);

  return {
    addOnsTotal,
    subtotal,
    bundleDiscountAmount,
    tieredDiscountAmount,
    offerDiscountAmount,
    couponDiscountAmount,
    milestoneRewardAmount,
    totalDiscountAmount,
    total
  };
}
