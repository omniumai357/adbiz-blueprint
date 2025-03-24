
import { BundleDiscountInfo } from "@/components/checkout/bundle-discount";

// Bundle discount with clearer benefits
export const bundleDiscount: BundleDiscountInfo = {
  id: "bundle-discount-1",
  name: "Bundle Discount",
  description: "Save when you add more services to your package",
  discountAmount: 10,
  discountType: "percentage",
  threshold: 50, // Minimum add-on value to qualify
  active: true
};

export function useDiscount(subtotal: number, addOnsTotal: number) {
  // Check if discount is applicable
  const isDiscountApplicable = addOnsTotal >= bundleDiscount.threshold;
  
  // Calculate the discount amount if applicable
  const discountAmount = isDiscountApplicable 
    ? (bundleDiscount.discountType === "percentage" 
      ? (subtotal * bundleDiscount.discountAmount / 100) 
      : bundleDiscount.discountAmount)
    : 0;
  
  return {
    bundleDiscount,
    isDiscountApplicable,
    discountAmount
  };
}
