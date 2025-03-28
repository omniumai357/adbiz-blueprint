
import { useCallback } from "react";
import { TourPath, TourStep } from "@/contexts/tour/types";

/**
 * Returns filtered and sorted tour steps based on conditions
 * @param steps Array of tour steps
 * @param userData Optional user data for condition evaluation
 * @returns Filtered and sorted steps
 */
export function processSteps(steps: TourStep[], userData?: any): TourStep[] {
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return [];
  }

  // Filter steps first
  const filteredSteps = steps.filter(step => {
    // Skip steps marked as hidden
    if (step.isHidden) {
      return false;
    }

    // Evaluate conditional display
    if (typeof step.condition === 'function') {
      try {
        // Don't pass any arguments if it's not expecting any
        // Some condition functions might be expecting data, others might not
        if (step.condition.length === 0) {
          return step.condition();
        } else {
          return step.condition(userData);
        }
      } catch (error) {
        console.error(`Error evaluating condition for step ${step.id}:`, error);
        return false;
      }
    }

    return true;
  });

  // Sort steps by order if provided
  const sortedSteps = [...filteredSteps].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return 0;
  });

  return sortedSteps;
}

/**
 * Hook for processing tour steps based on conditions and order
 */
export function useStepProcessor() {
  const processStepsCallback = useCallback(
    (steps: TourStep[], userData?: any) => processSteps(steps, userData),
    []
  );

  return {
    processSteps: processStepsCallback
  };
}
