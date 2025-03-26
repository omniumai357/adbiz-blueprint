
import { TourPath, TourStep } from "@/contexts/tour-context";

/**
 * Helper function to create tour paths with conditional steps
 * 
 * @param id Unique identifier for the tour path
 * @param name Display name for the tour path
 * @param steps Array of tour steps
 * @returns A configured TourPath object
 */
export function createTourPath(
  id: string,
  name: string,
  steps: TourStep[]
): TourPath {
  return {
    id,
    name,
    steps
  };
}

/**
 * Creates a conditional step that only shows when the condition is true
 * 
 * @param step The tour step to make conditional
 * @param condition Function that returns true if step should be shown
 * @returns A configured TourStep with condition
 */
export function conditionalStep(
  step: TourStep,
  condition: () => boolean
): TourStep {
  return {
    ...step,
    condition
  };
}

/**
 * Adds animation effects to a tour step
 * 
 * @param step The tour step to enhance with animations
 * @param animation Animation configuration objects
 * @returns A configured TourStep with animations
 */
export function animatedStep(
  step: TourStep,
  animation: {
    entry?: string;
    exit?: string;
    highlight?: string;
  }
): TourStep {
  return {
    ...step,
    animation
  };
}

/**
 * Creates an optional step that can be skipped
 * 
 * @param step The tour step to make optional
 * @returns A configured TourStep marked as optional
 */
export function optionalStep(step: TourStep): TourStep {
  return {
    ...step,
    isOptional: true
  };
}
