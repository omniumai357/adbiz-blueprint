
import { useCallback } from 'react';
import { TourStep } from '@/contexts/tour/types';

/**
 * Hook that provides navigation helpers with dependency awareness
 */
export function useTourDependencyNavigation(
  visibleSteps: TourStep[],
  currentStep: number,
  canAccessStep: (stepId: string) => boolean,
  resolveNextStep: (stepId: string) => string | null,
  setCurrentStep: (step: number) => void
) {
  // Find next accessible step after the current one
  const findNextAccessibleStep = useCallback(() => {
    if (currentStep >= visibleSteps.length - 1) return -1;
    
    let nextStepIndex = currentStep + 1;
    
    // If the immediate next step isn't accessible, look for the next one that is
    while (
      nextStepIndex < visibleSteps.length && 
      !canAccessStep(visibleSteps[nextStepIndex].id)
    ) {
      nextStepIndex++;
    }
    
    // Return -1 if no accessible step is found
    if (nextStepIndex >= visibleSteps.length) {
      return -1;
    }
    
    return nextStepIndex;
  }, [currentStep, visibleSteps, canAccessStep]);
  
  // Find previous accessible step before the current one
  const findPrevAccessibleStep = useCallback(() => {
    if (currentStep <= 0) return -1;
    
    let prevStepIndex = currentStep - 1;
    
    // If the immediate previous step isn't accessible, look for the previous one that is
    while (prevStepIndex >= 0 && !canAccessStep(visibleSteps[prevStepIndex].id)) {
      prevStepIndex--;
    }
    
    // Return -1 if no accessible step is found
    if (prevStepIndex < 0) {
      return -1;
    }
    
    return prevStepIndex;
  }, [currentStep, visibleSteps, canAccessStep]);
  
  // Check for branching logic and navigate to branch target if applicable
  const tryNavigateToBranch = useCallback((currentStepId: string) => {
    const branchTargetId = resolveNextStep(currentStepId);
    
    if (branchTargetId) {
      // If branch target is found, find its index and navigate to it
      const branchTargetIndex = visibleSteps.findIndex(step => step.id === branchTargetId);
      if (branchTargetIndex >= 0) {
        setCurrentStep(branchTargetIndex);
        return true;
      }
    }
    
    return false;
  }, [visibleSteps, resolveNextStep, setCurrentStep]);
  
  return {
    findNextAccessibleStep,
    findPrevAccessibleStep,
    tryNavigateToBranch
  };
}
