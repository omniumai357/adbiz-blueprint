
import { AddOnItem } from "@/components/checkout/add-on-item";
import { useState, useEffect } from "react";

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
 * @param props Object containing base price, add-ons, and discounts
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
  
  // Calculate subtotal (before discounts)
  const subtotal = packagePrice + addOnsTotal;
  
  // Calculate total (after discounts)
  const total = Math.max(0, subtotal - totalDiscountAmount);
  
  return {
    addOnsTotal,
    subtotal,
    total
  };
}
