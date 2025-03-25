
/**
 * Checkout Hooks Index
 * 
 * Centralizes all checkout-related hooks for easy import
 * throughout the application. Organizes hooks by functionality
 * and provides clear naming to avoid conflicts.
 */

// Export the main hooks
export * from './useCheckout';
export * from './useCheckoutAuth';
export * from './useCustomerInfo';
export * from './usePackageDetails';
export * from './usePaymentMethod';
export * from './useOrderProcessing';
export * from './useLoyaltyProgram';
export * from './useOrderDetails';
export * from './usePaymentOptions';
export * from './useDiscountState';
export * from './useCouponHandling';
export * from './useCheckoutState';
export * from './useCheckoutEffects';
export * from './useCheckoutActions';

// Export the new refactored hooks
export * from './useCheckoutAddOns';
export * from './useCheckoutDiscounts';
export * from './useCheckoutTotals';

// Export types
export * from './types';

// Export renamed utilities to avoid naming conflicts
export { 
  useAddOns,
  availableAddOns,
  bundleDiscount as addOnsBundleDiscount 
} from './useAddOns';

export { 
  useDiscount,
  discountTiers,
  bundleDiscount as discountBundleDiscount 
} from './useDiscount';

// Export additional hooks
export * from './useCoupons';
export * from './useLimitedTimeOffers';
