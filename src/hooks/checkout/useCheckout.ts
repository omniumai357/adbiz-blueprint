
import { useCheckoutAuth } from "./useCheckoutAuth";
import { useCustomerInfo } from "./useCustomerInfo";
import { usePackageDetails } from "./usePackageDetails";
import { usePaymentMethod } from "./usePaymentMethod";
import { useAddOns, availableAddOns, bundleDiscount } from "./useAddOns";
import { useDiscount, discountTiers } from "./useDiscount";
import { useOrderProcessing } from "./useOrderProcessing";
import { useCoupons } from "./useCoupons";
import { useLimitedTimeOffers } from "./useLimitedTimeOffers";
import { useLoyaltyProgram } from "./useLoyaltyProgram";
import { useCheckoutCalculations } from "./useCheckoutCalculations";

export function useCheckout() {
  // Get authentication status
  const { userId } = useCheckoutAuth();
  
  // Get package details from router state
  const { packageName, packagePrice, packageDetails } = usePackageDetails();
  
  // Get customer info with profile data if available
  const { customerInfo, setCustomerInfo, isProfileLoading } = useCustomerInfo(userId);
  
  // Get payment method state
  const { paymentMethod, setPaymentMethod } = usePaymentMethod();

  // Use add-ons hook
  const {
    selectedAddOnIds,
    selectedAddOns,
    addOnsTotal,
    handleAddOnToggle
  } = useAddOns(bundleDiscount.threshold);
  
  // Calculate the subtotal (package + add-ons)
  const subtotal = packagePrice + addOnsTotal;
  
  // Use discount hook with user ID for first-purchase detection
  const {
    isDiscountApplicable,
    bundleDiscountAmount,
    appliedTier,
    tieredDiscountAmount,
    isFirstPurchase,
    firstPurchaseBonus,
    totalDiscountAmount: baseDiscountAmount,
    isLoading: isDiscountLoading
  } = useDiscount(subtotal, addOnsTotal, userId);

  // Use coupons hook for personalized and limited-time offers
  const {
    personalizedCoupon,
    appliedCoupon,
    couponDiscountAmount,
    isCheckingCoupon,
    applyCoupon,
    removeCoupon
  } = useCoupons(userId, subtotal);

  // Use limited time offers hook
  const {
    activeOffers,
    availableOffer,
    offerDiscountAmount,
    isLoading: isOffersLoading
  } = useLimitedTimeOffers(subtotal);

  // Use loyalty program hook
  const {
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle
  } = useLoyaltyProgram(userId, subtotal);
  
  // Calculate totals
  const {
    totalDiscountAmount,
    total
  } = useCheckoutCalculations(
    packagePrice,
    addOnsTotal,
    baseDiscountAmount,
    loyaltyBonusAmount,
    couponDiscountAmount,
    offerDiscountAmount
  );

  // Use order processing hook
  const {
    showDownloadOptions,
    orderId,
    invoiceNumber,
    isGeneratingInvoice,
    handleOrderSuccess
  } = useOrderProcessing({
    userId,
    packageName,
    packageDetails,
    selectedAddOns,
    isDiscountApplicable,
    bundleDiscount,
    tieredDiscount: appliedTier,
    isFirstPurchase,
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    totalDiscountAmount,
    total,
    customerInfo
  });

  return {
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod,
    showDownloadOptions,
    orderId,
    invoiceNumber,
    isGeneratingInvoice,
    userId,
    packageName,
    packagePrice,
    packageDetails,
    isProfileLoading,
    handleOrderSuccess,
    // Add-ons related
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns,
    // Bundle discount related
    bundleDiscount,
    isDiscountApplicable,
    bundleDiscountAmount,
    // Tiered discount related
    discountTiers,
    appliedTier,
    isFirstPurchase,
    tieredDiscountAmount,
    firstPurchaseBonus,
    // Loyalty program related
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle,
    // Coupon related
    personalizedCoupon,
    appliedCoupon,
    couponDiscountAmount,
    isCheckingCoupon,
    applyCoupon,
    removeCoupon,
    // Limited-time offers related
    activeOffers,
    availableOffer,
    offerDiscountAmount,
    // Loading states
    isLoading: isProfileLoading || isDiscountLoading || isCheckingCoupon || isOffersLoading,
    // Calculated values
    subtotal,
    totalDiscountAmount,
    total
  };
}
