
/**
 * Types Barrel Export
 * 
 * This file consolidates all application type exports,
 * making imports cleaner throughout the application.
 */

// Re-export API types
export * from './api';

// Export checkout types, excluding those that would conflict with API types
export type {
  CustomerInfoFormProps,
  CustomerBusinessInfoProps,
  CustomerPersonalInfoProps,
  InvoiceDeliveryOptionsProps,
  PaymentMethod,
  PaymentOptionProps,
  CheckoutState,
  PackageDetails,
  AddOnItem
} from './checkout';

// Export company types, excluding those that would conflict with API types
export type {
  SocialLinks
} from './company';

// Export contact types
export * from './contact';

// Export shared interfaces
export * from './shared-interfaces';
