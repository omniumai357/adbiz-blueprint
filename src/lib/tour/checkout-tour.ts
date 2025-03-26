
import { 
  createTourPath, 
  conditionalStep, 
  animatedStep, 
  optionalStep,
  roleRestrictedStep,
  mediaEnhancedStep,
  actionEnhancedStep,
  enhanceStep
} from "./createTourPath";

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

// Function to check if user is returning customer
const isReturningCustomer = () => {
  const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
  return completedTours.includes('checkout-tour');
};

// Function to check if user is on mobile
const isMobileDevice = () => {
  return window.innerWidth < 768;
};

// Helper to show the appropriate payment step based on device
const getPaymentStep = () => {
  const baseStep = {
    id: "payment-methods",
    elementId: "payment-method-section",
    title: "Payment Methods",
    content: "Choose your preferred payment method to complete your purchase.",
    position: "left"
  };
  
  // Mobile users get a simpler step with different position
  if (isMobileDevice()) {
    return {
      ...baseStep,
      position: "bottom",
      content: "Select your payment method from the options below.",
    };
  }
  
  return baseStep;
};

export const checkoutTourPath = createTourPath(
  "checkout-tour",
  "Checkout Page Tour",
  [
    enhanceStep(
      {
        id: "welcome",
        elementId: "checkout-header",
        title: "Welcome to Checkout",
        content: "This is the checkout page where you can complete your purchase. Let's walk through the process.",
        position: "bottom"
      },
      (step) => animatedStep(step, { highlight: "glow", entry: "fade-up" }),
      (step) => conditionalStep(step, () => !isReturningCustomer())
    ),
    
    enhanceStep(
      {
        id: "welcome-returning",
        elementId: "checkout-header",
        title: "Welcome Back",
        content: "Welcome back to checkout! We've customized this tour for returning customers.",
        position: "bottom"
      },
      (step) => animatedStep(step, { highlight: "glow", entry: "fade-up" }),
      (step) => conditionalStep(step, isReturningCustomer)
    ),
    
    enhanceStep(
      {
        id: "customer-info",
        elementId: "customer-info-section",
        title: "Customer Information",
        content: "Here you can enter your personal and business details. This information will be used for your invoice.",
        position: "right"
      },
      (step) => animatedStep(step, { highlight: "pulse", entry: "scale-in" })
    ),
    
    enhanceStep(
      {
        id: "add-ons",
        elementId: "add-ons-section",
        title: "Service Add-ons",
        content: "Enhance your package with these optional add-ons. Select any that might benefit your business.",
        position: "left"
      },
      (step) => animatedStep(step, { highlight: "bounce", entry: "slide-in" }),
      (step) => mediaEnhancedStep(step, {
        type: "image",
        url: "/placeholder.svg",
        alt: "Example add-ons selection"
      })
    ),
    
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
    
    // The payment step will adapt based on device
    enhanceStep(
      getPaymentStep(),
      (step) => animatedStep(step, { highlight: "pulse", entry: "fade-up" })
    ),
    
    enhanceStep(
      {
        id: "order-summary",
        elementId: "order-summary-section",
        title: "Order Summary",
        content: "Review your order details, including selected package, add-ons, and total cost before finalizing.",
        position: "right"
      },
      (step) => animatedStep(step, { highlight: "glow", entry: "float" }),
      (step) => optionalStep(step),
      (step) => actionEnhancedStep(step, {
        next: {
          label: "Complete Tour",
        },
        skip: {
          label: "Finish Shopping"
        }
      })
    )
  ],
  {
    allowSkip: true,
    showProgress: true,
    completionCallback: () => {
      console.log("Checkout tour completed!");
    },
    metadata: {
      importance: "high",
      averageCompletionTimeSeconds: 120
    }
  }
);
