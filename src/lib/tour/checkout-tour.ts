
import { 
  createTourPath, 
  createStep,
  enhanceStep,
  conditionalStep, 
  animatedStep, 
  optionalStep,
  roleRestrictedStep,
  mediaEnhancedStep,
  actionEnhancedStep
} from "./index";

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

export const checkoutTourPath = createTourPath(
  "checkout-tour",
  "Checkout Page Tour",
  [
    enhanceStep(
      createStep(
        "welcome",
        "checkout-header",
        "Welcome to Checkout",
        "This is the checkout page where you can complete your purchase. Let's walk through the process.",
        "bottom"
      ),
      step => {
        // Chain enhancers
        const withAnimation = animatedStep({ highlight: "glow", entry: "fade-up" })(step);
        return conditionalStep(() => !isReturningCustomer())(withAnimation);
      }
    ),
    
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
        return conditionalStep(isReturningCustomer)(withAnimation);
      }
    ),
    
    enhanceStep(
      createStep(
        "customer-info",
        "customer-info-section",
        "Customer Information",
        "Here you can enter your personal and business details. This information will be used for your invoice.",
        "right"
      ),
      animatedStep({ highlight: "pulse", entry: "scale-in" })
    ),
    
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
        return mediaEnhancedStep({
          type: "image",
          url: "/placeholder.svg",
          alt: "Example add-ons selection"
        })(withAnimation);
      }
    ),
    
    conditionalStep(hasAvailableDiscounts)(
      animatedStep({ highlight: "dashed", entry: "fade-in" })(
        createStep(
          "discounts",
          "discounts-section",
          "Available Discounts",
          "View applicable discounts and special offers. You can also enter coupon codes here.",
          "top"
        )
      )
    ),
    
    conditionalStep(hasSavedPaymentMethods)(
      animatedStep({ highlight: "solid", entry: "scale-in" })(
        createStep(
          "saved-payment-methods",
          "saved-payment-methods",
          "Your Saved Payment Methods",
          "Choose from your previously saved payment methods for faster checkout.",
          "left"
        )
      )
    ),
    
    // The payment step will adapt based on device
    enhanceStep(
      getPaymentStep(),
      animatedStep({ highlight: "pulse", entry: "fade-up" })
    ),
    
    enhanceStep(
      createStep(
        "order-summary",
        "order-summary-section",
        "Order Summary",
        "Review your order details, including selected package, add-ons, and total cost before finalizing.",
        "right"
      ),
      step => {
        const withAnimation = animatedStep({ highlight: "glow", entry: "float" })(step);
        const withOptional = optionalStep()(withAnimation);
        return actionEnhancedStep({
          next: {
            label: "Complete Tour",
          },
          skip: {
            label: "Finish Shopping"
          }
        })(withOptional);
      }
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
