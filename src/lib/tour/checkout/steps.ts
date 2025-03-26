
import { createStep } from '../core/tourPathFactory';
import { isMobileDevice } from './conditions';

/**
 * Checkout tour step factory functions
 */

// Helper to show the appropriate payment step based on device
export const getPaymentStep = () => {
  const baseStep = createStep(
    "payment-methods",
    "payment-method-section",
    "Payment Methods",
    "Choose your preferred payment method to complete your purchase.",
    "left"
  );
  
  // Mobile users get a simpler step with different position
  if (isMobileDevice()) {
    return createStep(
      "payment-methods",
      "payment-method-section",
      "Payment Methods",
      "Select your payment method from the options below.",
      "bottom"
    );
  }
  
  return baseStep;
};

// Create welcome step for new customers
export const createWelcomeStep = () => {
  return createStep(
    "welcome",
    "checkout-header",
    "Welcome to Checkout",
    "This is the checkout page where you can complete your purchase. Let's walk through the process.",
    "bottom"
  );
};

// Create welcome step for returning customers
export const createWelcomeReturningStep = () => {
  return createStep(
    "welcome-returning",
    "checkout-header",
    "Welcome Back",
    "Welcome back to checkout! We've customized this tour for returning customers.",
    "bottom"
  );
};

// Create customer info step
export const createCustomerInfoStep = () => {
  return createStep(
    "customer-info",
    "customer-info-section",
    "Customer Information",
    "Here you can enter your personal and business details. This information will be used for your invoice.",
    "right"
  );
};

// Create add-ons step
export const createAddOnsStep = () => {
  return createStep(
    "add-ons",
    "add-ons-section",
    "Service Add-ons",
    "Enhance your package with these optional add-ons. Select any that might benefit your business.",
    "left"
  );
};

// Create discounts step
export const createDiscountsStep = () => {
  return createStep(
    "discounts",
    "discounts-section",
    "Available Discounts",
    "View applicable discounts and special offers. You can also enter coupon codes here.",
    "top"
  );
};

// Create saved payment methods step
export const createSavedPaymentMethodsStep = () => {
  return createStep(
    "saved-payment-methods",
    "saved-payment-methods",
    "Your Saved Payment Methods",
    "Choose from your previously saved payment methods for faster checkout.",
    "left"
  );
};

// Create order summary step
export const createOrderSummaryStep = () => {
  return createStep(
    "order-summary",
    "order-summary-section",
    "Order Summary",
    "Review your order details, including selected package, add-ons, and total cost before finalizing.",
    "right"
  );
};
