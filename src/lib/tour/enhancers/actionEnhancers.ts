
import { TourStep } from "@/contexts/tour-context";

// Define StepTrigger interface
export interface StepTrigger {
  event: string;
  element?: string;
  condition?: () => boolean;
  action: () => void;
}

/**
 * Adds custom button actions to a tour step
 * 
 * @param actions Custom action configuration
 * @returns A function that enhances the step with custom actions
 */
export function actionEnhancedStep(
  actions: {
    next?: {
      label?: string;
      callback?: () => void;
    };
    prev?: {
      label?: string;
      callback?: () => void;
    };
    skip?: {
      label?: string;
      callback?: () => void;
    };
  }
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      actions
    };
  };
}

/**
 * Adds event triggers to a tour step
 * 
 * @param triggers Array of trigger configurations
 * @returns A function that enhances the step with triggers
 */
export function triggerEnhancedStep(
  triggers: StepTrigger[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      triggers
    };
  };
}

/**
 * Sets the priority of a tour step
 * 
 * @param priority Priority level (higher numbers = higher priority)
 * @returns A function that enhances the step with priority
 */
export function prioritizedStep(
  priority: number
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      priority
    };
  };
}
