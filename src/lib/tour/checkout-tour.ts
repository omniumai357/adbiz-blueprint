
import { createTourPath } from './core/paths/createTourPath';
import { TourStep } from '@/contexts/tour/types';

// Import step groups but convert them to the right type
import {
  checkoutWelcomeStepGroup,
  checkoutCoreStepGroup,
  checkoutOptionalStepGroup,
  checkoutFinalStepGroup
} from './checkout/step-groups';

// Helper function to adapt steps between different TourStep interfaces
function adaptTourSteps(steps: any[]): TourStep[] {
  return steps.map(step => {
    // Ensure target property is always present
    const adaptedStep: TourStep = {
      ...step,
      target: step.target || document.body.tagName, // Provide a fallback target
    };
    
    return adaptedStep;
  });
}

/**
 * Main checkout tour path definition using step groups
 */
export const checkoutTourPath = createTourPath([
  ...adaptTourSteps(checkoutWelcomeStepGroup.steps),
  ...adaptTourSteps(checkoutCoreStepGroup.steps),
  ...adaptTourSteps(checkoutOptionalStepGroup.steps),
  ...adaptTourSteps(checkoutFinalStepGroup.steps)
]);

// Add an event listener for tour completion
document.addEventListener('tour:complete', (e: any) => {
  if (e.detail?.tourId === 'checkout-tour') {
    console.log("Checkout tour completed!");
  }
});
