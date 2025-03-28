
import { useState, useCallback } from "react";
import { AddOnItem } from "@/components/checkout/add-on-item";

interface UseCheckoutTotalsProps {
  packagePrice: number;
  selectedAddOns: AddOnItem[];
  totalDiscountAmount: number;
}

/**
 * Hook for calculating checkout totals
 * 
 * Extracted from useCheckout to improve modularity and maintainability
 * 
 * @param props Object containing price data for calculations
 * @returns Object containing calculated totals
 */
export function useCheckoutTotals({
  packagePrice,
  selectedAddOns,
  totalDiscountAmount
}: UseCheckoutTotalsProps) {
  // Calculate add-ons total
  const addOnsTotal = selectedAddOns.reduce(
    (sum, addon) => sum + addon.price, 
    0
  );
  
  // Calculate subtotal (package + add-ons)
  const subtotal = packagePrice + addOnsTotal;
  
  // Calculate final total (subtotal - discounts)
  const [total, setTotal] = useState(Math.max(0, subtotal - totalDiscountAmount));
  
  // Recalculate total based on current values
  const recalculate = useCallback(() => {
    setTotal(Math.max(0, subtotal - totalDiscountAmount));
  }, [subtotal, totalDiscountAmount]);
  
  // Update total when inputs change
  if (total !== Math.max(0, subtotal - totalDiscountAmount)) {
    recalculate();
  }
  
  return {
    addOnsTotal,
    subtotal,
    total,
    recalculate
  };
}
