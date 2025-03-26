
import { createTourPath } from './core/paths/createTourPath';

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
export const checkoutTourPath = createTourPath(
  "checkout-tour",
  "Checkout Page Tour",
  [
    ...checkoutWelcomeStepGroup.steps,
    ...checkoutCoreStepGroup.steps,
    ...checkoutOptionalStepGroup.steps,
    ...checkoutFinalStepGroup.steps
  ],
  {
    allowSkip: true,
    showProgress: true,
    route: '/checkout',
    // Store the callback in metadata to work around the type limitation
    userRoles: ['customer'],
    displayCondition: () => {
      console.log("Checkout tour condition check");
      return true;
    }
  }
);

// Add an event listener for tour completion
document.addEventListener('tour:complete', (e: any) => {
  if (e.detail?.tourId === 'checkout-tour') {
    console.log("Checkout tour completed!");
  }
});
