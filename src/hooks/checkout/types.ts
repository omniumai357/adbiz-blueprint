
// Common types for checkout hooks
export type PaymentMethod = "credit-card" | "paypal";

export interface CheckoutDiscountInfo {
  bundleDiscount?: any;
  tieredDiscount?: any;
  isFirstPurchase?: boolean;
  loyaltyProgram?: {
    enabled: boolean;
    bonusAmount: number;
  } | null;
  limitedTimeOffer?: {
    name: string;
    discountAmount: number;
  } | null;
  coupon?: {
    code: string;
    discountAmount: number;
  } | null;
  totalDiscount: number;
}
