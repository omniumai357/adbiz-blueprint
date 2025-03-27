
import { TourStep } from '@/contexts/tour/types';

// Define the StepTrigger type
export interface StepTrigger {
  id: string;
  event: string;
  selector: string;
  action: 'next' | 'prev' | 'skip' | 'go-to' | 'custom';
  targetStep?: number;
  customAction?: () => void;
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

/**
 * Enhancer to add triggers that cause the tour to advance
 */
export const withStepTriggers = (triggers: StepTrigger[]): ((step: TourStep) => Partial<TourStep>) => {
  return (step: TourStep) => {
    // Convert triggers to strings to make TypeScript happy
    const triggerIds = triggers.map(trigger => trigger.id);
    
    return {
      // Explicitly specify return type as strings
      triggers: triggerIds,
      triggerData: triggers
    };
  };
};
