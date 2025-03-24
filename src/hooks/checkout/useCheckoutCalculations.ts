
export function useCheckoutCalculations(
  packagePrice: number,
  addOnsTotal: number,
  baseDiscountAmount: number,
  loyaltyBonusAmount: number,
  couponDiscountAmount: number,
  offerDiscountAmount: number
) {
  // Calculate the subtotal (package + add-ons)
  const subtotal = packagePrice + addOnsTotal;
  
  // Calculate total discount (base discounts + loyalty bonus + coupon + limited-time offer)
  const totalDiscountAmount = baseDiscountAmount + loyaltyBonusAmount + 
                              couponDiscountAmount + offerDiscountAmount;
  
  // Calculate the final total with all discounts
  const total = Math.max(0, subtotal - totalDiscountAmount);

  return {
    subtotal,
    totalDiscountAmount,
    total
  };
}
