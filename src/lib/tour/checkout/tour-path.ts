
import { 
  createTourPath, 
  enhanceStep,
  conditionalStep, 
  animatedStep, 
  optionalStep,
  mediaEnhancedStep,
  actionEnhancedStep
} from '../index';

import {
  hasAvailableDiscounts,
  hasSavedPaymentMethods,
  isReturningCustomer
} from './conditions';

import {
  getPaymentStep,
  createWelcomeStep,
  createWelcomeReturningStep,
  createCustomerInfoStep,
  createAddOnsStep,
  createDiscountsStep,
  createSavedPaymentMethodsStep,
  createOrderSummaryStep
} from './steps';

/**
 * Main checkout tour path definition
 */
export const checkoutTourPath = createTourPath(
  "checkout-tour",
  [
    enhanceStep(
      createWelcomeStep(),
      step => {
        // Chain enhancers
        const withAnimation = animatedStep({ highlight: "glow", entry: "fade-up" })(step);
        return conditionalStep(() => !isReturningCustomer())(withAnimation);
      }
    ),
    
    enhanceStep(
      createWelcomeReturningStep(),
      step => {
        const withAnimation = animatedStep({ highlight: "glow", entry: "fade-up" })(step);
        return conditionalStep(isReturningCustomer)(withAnimation);
      }
    ),
    
    enhanceStep(
      createCustomerInfoStep(),
      animatedStep({ highlight: "pulse", entry: "scale-in" })
    ),
    
    enhanceStep(
      createAddOnsStep(),
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
        createDiscountsStep()
      )
    ),
    
    conditionalStep(hasSavedPaymentMethods)(
      animatedStep({ highlight: "solid", entry: "scale-in" })(
        createSavedPaymentMethodsStep()
      )
    ),
    
    // The payment step will adapt based on device
    enhanceStep(
      getPaymentStep(),
      animatedStep({ highlight: "pulse", entry: "fade-up" })
    ),
    
    enhanceStep(
      createOrderSummaryStep(),
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
