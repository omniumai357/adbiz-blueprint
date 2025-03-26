
import { createTourPathFromGroups } from './index';

// Import step groups
import {
  checkoutWelcomeStepGroup,
  checkoutCoreStepGroup,
  checkoutOptionalStepGroup,
  checkoutFinalStepGroup
} from './checkout/step-groups';

/**
 * Main checkout tour path definition using step groups
 */
export const checkoutTourPath = createTourPathFromGroups(
  "checkout-tour",
  "Checkout Page Tour",
  [
    'checkout-welcome',  // Welcome steps vary based on customer type
    'checkout-core',     // Core checkout steps for all users
    'checkout-optional', // Optional features shown conditionally
    'checkout-final'     // Final checkout steps and summary
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
