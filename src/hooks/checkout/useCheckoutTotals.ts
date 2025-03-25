
import { useEffect, useState } from "react";
import { AddOnItem } from "@/types/checkout";

interface UseCheckoutTotalsProps {
  packagePrice: number;
  selectedAddOns: AddOnItem[];
  totalDiscountAmount: number;
}

/**
 * Hook for calculating checkout totals
 * 
 * @param props Object containing base values for calculation
 * @returns Object containing calculated totals
 */
export function useCheckoutTotals({
  packagePrice,
  selectedAddOns,
  totalDiscountAmount
}: UseCheckoutTotalsProps) {
  const [addOnsTotal, setAddOnsTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
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

  // Calculate final total
  useEffect(() => {
    setTotal(Math.max(0, subtotal - totalDiscountAmount));
  }, [subtotal, totalDiscountAmount]);

  return {
    addOnsTotal,
    subtotal,
    total,
    recalculate: () => {
      // This can be called to force a recalculation if needed
      const newAddOnsTotal = selectedAddOns.reduce(
        (sum, addon) => sum + addon.price,
        0
      );
      const newSubtotal = packagePrice + newAddOnsTotal;
      const newTotal = Math.max(0, newSubtotal - totalDiscountAmount);
      
      setAddOnsTotal(newAddOnsTotal);
      setSubtotal(newSubtotal);
      setTotal(newTotal);
      
      return {
        addOnsTotal: newAddOnsTotal,
        subtotal: newSubtotal,
        total: newTotal
      };
    }
  };
}
