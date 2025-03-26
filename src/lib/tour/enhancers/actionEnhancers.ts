
import { TourStep, StepTrigger } from "@/contexts/tour-context";

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
      onClick?: () => void;
    };
    prev?: {
      label?: string;
      onClick?: () => void;
    };
    skip?: {
      label?: string;
      onClick?: () => void;
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
