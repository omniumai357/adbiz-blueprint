
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
export * from './useAddOnSelection';
export * from './useCustomerCheckoutInfo';
export * from './useRewardsAndLoyalty';
export * from './usePaymentOptions';
export * from './useDiscountState';
export * from './useCouponHandling';

// Export from useAddOns but rename bundleDiscount to avoid conflicts
export { 
  useAddOns,
  availableAddOns,
  bundleDiscount as addOnsBundleDiscount 
} from './useAddOns';

// Export from useDiscount but rename bundleDiscount to avoid conflicts
export { 
  useDiscount,
  discountTiers,
  bundleDiscount as discountBundleDiscount 
} from './useDiscount';

// Export from other modules
export * from './useCoupons';
export * from './useLimitedTimeOffers';
export * from './types';
