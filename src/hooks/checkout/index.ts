
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
export * from './useCheckoutCalculations';
export * from './useOrderProcessing';
export * from './useLoyaltyProgram';
export * from './useOrderDetails';
export * from './usePaymentOptions';
export * from './useDiscountState';
export * from './useCouponHandling';
export * from './useCheckoutData';

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
