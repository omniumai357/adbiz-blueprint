
import { TourStep } from '@/contexts/tour/types';

/**
 * Enhances steps with dynamic path connectors
 * 
 * @param steps Array of tour steps to enhance
 * @returns Enhanced steps with path connectors
 */
export function addPathConnectors(steps: TourStep[]): TourStep[] {
  return steps.map((step, index) => {
    // Skip the last step
    if (index === steps.length - 1) {
      return step;
    }

    // Get the next step ID
    const nextStepId = steps[index + 1].elementId;
    
    // Don't override if step already has a path configured
    if (step.path) {
      return step;
    }
    
    // Add a path to the next step
    return {
      ...step,
      path: {
        enabled: true,
        targetElementId: nextStepId,
        style: 'dashed',
        color: 'currentColor',
        animationDuration: 500,
        showArrow: true
      }
    };
  });
}
