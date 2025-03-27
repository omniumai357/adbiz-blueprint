
import { createTourPath } from './core/paths/createTourPath';
import { TourStep } from './types';

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
export const checkoutTourPath = createTourPath([
  ...checkoutWelcomeStepGroup.steps,
  ...checkoutCoreStepGroup.steps,
  ...checkoutOptionalStepGroup.steps,
  ...checkoutFinalStepGroup.steps
]);

// Add an event listener for tour completion
document.addEventListener('tour:complete', (e: any) => {
  if (e.detail?.tourId === 'checkout-tour') {
    console.log("Checkout tour completed!");
  }
});
