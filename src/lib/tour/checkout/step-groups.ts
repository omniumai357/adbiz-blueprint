
import { 
  createStep, 
  createStepGroup, 
  enhanceStep,
  animatedStep,
  conditionalStep,
  stepInGroup
} from '@/lib/tour/index';

import {
  hasAvailableDiscounts,
  hasSavedPaymentMethods,
  isReturningCustomer
} from './conditions';

/**
 * Welcome steps group for checkout - varies based on customer type
 */
export const checkoutWelcomeStepGroup = createStepGroup(
  'checkout-welcome',
  'Checkout Welcome',
  [
    // Welcome step for new customers
    enhanceStep(
      createStep(
        "welcome",
        "checkout-header",
        "Welcome to Checkout",
        "This is the checkout page where you can complete your purchase. Let's walk through the process.",
        "bottom"
      ),
      step => {
        const withAnimation = animatedStep({ highlight: "glow", entry: "fade-up" })(step);
        return conditionalStep(() => !isReturningCustomer())(
          stepInGroup('checkout-welcome')(withAnimation)
        );
      }
    ),
    
    // Welcome step for returning customers
    enhanceStep(
      createStep(
        "welcome-returning",
        "checkout-header",
        "Welcome Back",
        "Welcome back to checkout! We've customized this tour for returning customers.",
        "bottom"
      ),
      step => {
        const withAnimation = animatedStep({ highlight: "glow", entry: "fade-up" })(step);
        return conditionalStep(isReturningCustomer)(
          stepInGroup('checkout-welcome')(withAnimation)
        );
      }
    ),
  ],
  'Welcome steps for the checkout process'
);

/**
 * Core checkout steps group - essential steps for all users
 */
export const checkoutCoreStepGroup = createStepGroup(
  'checkout-core',
  'Core Checkout Steps',
  [
    // Customer information step
    enhanceStep(
      createStep(
        "customer-info",
        "customer-info-section",
        "Customer Information",
        "Here you can enter your personal and business details. This information will be used for your invoice.",
        "right"
      ),
      step => animatedStep({ highlight: "pulse", entry: "scale-in" })(
        stepInGroup('checkout-core')(step)
      )
    ),
    
    // Add-ons step
    enhanceStep(
      createStep(
        "add-ons",
        "add-ons-section",
        "Service Add-ons",
        "Enhance your package with these optional add-ons. Select any that might benefit your business.",
        "left"
      ),
      step => {
        const withAnimation = animatedStep({ highlight: "bounce", entry: "slide-in" })(step);
        return stepInGroup('checkout-core')(withAnimation);
      }
    ),
  ],
  'Core steps for the checkout process'
);

/**
 * Optional checkout features step group - shown conditionally
 */
export const checkoutOptionalStepGroup = createStepGroup(
  'checkout-optional',
  'Optional Checkout Features',
  [
    // Discounts step - only shown if discounts are available
    enhanceStep(
      createStep(
        "discounts",
        "discounts-section",
        "Available Discounts",
        "View applicable discounts and special offers. You can also enter coupon codes here.",
        "top"
      ),
      step => {
        const withAnimation = animatedStep({ highlight: "dashed", entry: "fade-in" })(step);
        return conditionalStep(hasAvailableDiscounts)(
          stepInGroup('checkout-optional')(withAnimation)
        );
      }
    ),
    
    // Saved payment methods - only shown if user has saved methods
    enhanceStep(
      createStep(
        "saved-payment-methods",
        "saved-payment-methods",
        "Your Saved Payment Methods",
        "Choose from your previously saved payment methods for faster checkout.",
        "left"
      ),
      step => {
        const withAnimation = animatedStep({ highlight: "solid", entry: "scale-in" })(step);
        return conditionalStep(hasSavedPaymentMethods)(
          stepInGroup('checkout-optional')(withAnimation)
        );
      }
    ),
  ],
  'Optional features in the checkout process, shown conditionally'
);

/**
 * Final checkout steps group - completion and summary
 */
export const checkoutFinalStepGroup = createStepGroup(
  'checkout-final',
  'Checkout Summary',
  [
    // Payment method step
    enhanceStep(
      createStep(
        "payment-methods",
        "payment-method-section",
        "Payment Methods",
        "Choose your preferred payment method to complete your purchase.",
        "left"
      ),
      step => animatedStep({ highlight: "pulse", entry: "fade-up" })(
        stepInGroup('checkout-final')(step)
      )
    ),
    
    // Order summary step
    enhanceStep(
      createStep(
        "order-summary",
        "order-summary-section",
        "Order Summary",
        "Review your order details, including selected package, add-ons, and total cost before finalizing.",
        "right"
      ),
      step => stepInGroup('checkout-final')(step)
    ),
  ],
  'Final steps in the checkout process'
);
