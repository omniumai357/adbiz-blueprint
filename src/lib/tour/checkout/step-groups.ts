
import { createStepGroup } from '../core/tourStepGroups';
import {
  createStep,
  enhanceStep
} from '@/lib/tour/core/tourPathFactory';
import {
  optionalStep
} from '@/lib/tour/enhancers/visualEnhancers';

/**
 * Welcome step group for the checkout flow
 */
export const checkoutWelcomeStepGroup = createStepGroup(
  'checkout-welcome',
  'Checkout Welcome',
  [
    createStep(
      'welcome-to-checkout',
      'checkout-header',
      'Welcome to Checkout',
      'This tour will guide you through the checkout process.',
      'bottom'
    )
  ],
  'Introduction to the checkout page'
);

/**
 * Core checkout steps - required for all users
 */
export const checkoutCoreStepGroup = createStepGroup(
  'checkout-core',
  'Essential Steps',
  [
    createStep(
      'customer-info',
      'customer-info-section',
      'Customer Information',
      'Enter your personal and business details here.',
      'right'
    ),
    createStep(
      'payment-method',
      'payment-method-section',
      'Payment Method',
      'Choose your preferred payment method.',
      'left'
    )
  ],
  'Required steps in the checkout process'
);

/**
 * Optional steps in the checkout process
 */
export const checkoutOptionalStepGroup = createStepGroup(
  'checkout-optional',
  'Optional Features',
  [
    enhanceStep(
      createStep(
        'add-ons',
        'add-ons-section',
        'Additional Services',
        'Consider these add-ons to enhance your package.',
        'bottom'
      ),
      optionalStep
    ),
    enhanceStep(
      createStep(
        'discount-code',
        'discount-section',
        'Discount Code',
        'Enter a discount code if you have one.',
        'top'
      ),
      optionalStep
    )
  ],
  'Optional features you might want to explore'
);

/**
 * Final checkout steps
 */
export const checkoutFinalStepGroup = createStepGroup(
  'checkout-final',
  'Complete Order',
  [
    createStep(
      'order-summary',
      'order-summary-section',
      'Order Summary',
      'Review your order details before completing the purchase.',
      'right'
    ),
    createStep(
      'confirm-order',
      'confirm-button',
      'Complete Purchase',
      'Click here to confirm and complete your order.',
      'top'
    )
  ],
  'Final steps to complete your purchase'
);
