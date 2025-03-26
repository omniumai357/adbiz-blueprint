
import { TourPath } from '@/contexts/tour/types';
import { createStep } from '@/lib/tour/core/tourPathFactory';
import { mediaEnhancedStep, spotlightStep } from '@/lib/tour/enhancers/visualEnhancers';

/**
 * Tour path for the checkout page
 */
export const checkoutTourPath: TourPath = {
  id: 'checkout-tour',
  name: 'Checkout Page Tour',
  steps: [
    // Welcome to checkout
    {
      id: 'checkout-welcome',
      elementId: 'checkout-header',
      target: 'checkout-header', // Add target property
      title: 'Welcome to Checkout',
      content: 'This tour will guide you through the checkout process.',
      placement: 'bottom',
      animation: 'fade-in'
    },
    
    // Order summary
    {
      ...createStep(
        'order-summary',
        'order-summary-section',
        'Order Summary',
        'Review your order details before proceeding with payment.',
        'right'
      ),
      ...spotlightStep({
        intensity: 'medium',
        fadeBackground: true
      })({} as any)
    },
    
    // Payment methods
    {
      ...createStep(
        'payment-methods',
        'payment-section',
        'Payment Methods',
        'Choose from multiple payment options for your convenience.',
        'left'
      ),
      media: {
        type: 'image',
        url: '/images/payment-methods.png',
        alt: 'Available payment methods'
      }
    }
  ],
  allowSkip: true,
  showProgress: true,
  route: '/checkout'
};
