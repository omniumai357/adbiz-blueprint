
import { createTourPath, conditionalStep, animatedStep, optionalStep } from "./createTourPath";

// Function to check if user has payment methods saved
const hasSavedPaymentMethods = () => {
  // In reality, this would check local storage or context/state
  // For demo purposes, we'll return false
  return false;
};

// Function to check if discount section should be shown
const hasAvailableDiscounts = () => {
  // This would check user's discount eligibility
  return true;
};

export const checkoutTourPath = createTourPath(
  "checkout-tour",
  "Checkout Page Tour",
  [
    animatedStep({
      id: "welcome",
      elementId: "checkout-header",
      title: "Welcome to Checkout",
      content: "This is the checkout page where you can complete your purchase. Let's walk through the process.",
      position: "bottom"
    }, { highlight: "glow", entry: "fade-up" }),
    
    animatedStep({
      id: "customer-info",
      elementId: "customer-info-section",
      title: "Customer Information",
      content: "Here you can enter your personal and business details. This information will be used for your invoice.",
      position: "right"
    }, { highlight: "pulse", entry: "scale-in" }),
    
    animatedStep({
      id: "add-ons",
      elementId: "add-ons-section",
      title: "Service Add-ons",
      content: "Enhance your package with these optional add-ons. Select any that might benefit your business.",
      position: "left"
    }, { highlight: "bounce", entry: "slide-in" }),
    
    conditionalStep(
      animatedStep({
        id: "discounts",
        elementId: "discounts-section",
        title: "Available Discounts",
        content: "View applicable discounts and special offers. You can also enter coupon codes here.",
        position: "top"
      }, { highlight: "dashed", entry: "fade-in" }),
      hasAvailableDiscounts
    ),
    
    conditionalStep(
      animatedStep({
        id: "saved-payment-methods",
        elementId: "saved-payment-methods",
        title: "Your Saved Payment Methods",
        content: "Choose from your previously saved payment methods for faster checkout.",
        position: "left"
      }, { highlight: "solid", entry: "scale-in" }),
      hasSavedPaymentMethods
    ),
    
    animatedStep({
      id: "payment-methods",
      elementId: "payment-method-section",
      title: "Payment Methods",
      content: "Choose your preferred payment method to complete your purchase.",
      position: "left"
    }, { highlight: "pulse", entry: "fade-up" }),
    
    optionalStep(
      animatedStep({
        id: "order-summary",
        elementId: "order-summary-section",
        title: "Order Summary",
        content: "Review your order details, including selected package, add-ons, and total cost before finalizing.",
        position: "right"
      }, { highlight: "glow", entry: "float" })
    )
  ]
);
