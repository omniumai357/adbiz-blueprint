
import { TourStep } from "@/contexts/tour-context";
import { ConditionEvaluator } from "@/hooks/tour/analytics/types";

/**
 * Creates a conditional step that only shows when the condition is true
 * 
 * @param condition Function that returns true if step should be shown
 * @returns A function that enhances the step with a condition
 */
export function conditionalStep(
  condition: ConditionEvaluator
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      condition
    };
  };
}

/**
 * Creates a step with feature flag condition
 * 
 * @param featureFlag Feature flag name to check
 * @returns A function that enhances the step with a feature flag condition
 */
export function featureFlagStep(
  featureFlag: string
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const condition = () => {
      // Simple feature flag check implementation
      // In a real app, this would use your feature flag system
      const enabledFlags = localStorage.getItem('enabledFeatureFlags');
      if (!enabledFlags) return false;
      
      try {
        const flags = JSON.parse(enabledFlags);
        return !!flags[featureFlag];
      } catch (e) {
        return false;
      }
    };
    
    return {
      ...step,
      condition
    };
  };
}

/**
 * Creates a step that's shown based on user's tour completion history
 * 
 * @param requiredCompletedTours Array of tour IDs that must be completed
 * @returns A function that enhances the step to check tour completion
 */
export function progressBasedStep(
  requiredCompletedTours: string[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    const condition = () => {
      const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
      return requiredCompletedTours.every(tourId => completedTours.includes(tourId));
    };
    
    return {
      ...step,
      condition
    };
  };
}
