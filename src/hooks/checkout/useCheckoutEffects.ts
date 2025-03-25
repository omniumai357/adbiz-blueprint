
import { useEffect } from "react";

/**
 * Hook to manage side effects in the checkout process
 */
export function useCheckoutEffects({
  subtotal,
  updateLoyaltyBonus,
  updateCouponDiscountAmount
}: {
  subtotal: number;
  updateLoyaltyBonus: (subtotal: number) => void;
  updateCouponDiscountAmount: (subtotal: number) => void;
}) {
  // Update loyalty bonus whenever subtotal changes
  useEffect(() => {
    updateLoyaltyBonus(subtotal);
    updateCouponDiscountAmount(subtotal);
  }, [subtotal, updateLoyaltyBonus, updateCouponDiscountAmount]);
  
  return {
    // This hook primarily handles side effects and doesn't need to return anything
  };
}
