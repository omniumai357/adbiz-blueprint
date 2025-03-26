
import { useCallback } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';
import { useTourAnalytics } from '../../useTourAnalytics';
import { useTourDependencies } from '../dependency/use-tour-dependencies';

/**
 * Enhanced hook for tour navigation with dependency support
 */
export function useEnhancedTourNavigation(
  currentStep: number,
  currentPath: string | null,
  visibleSteps: TourStep[],
  availablePaths: TourPath[],
  completedStepIds: string[],
  setCurrentStep: (step: number) => void,
  userId?: string,
  userType?: string
) {
  const analytics = useTourAnalytics();
  
  // Get current path data
  const currentPathData = availablePaths.find(path => path.id === currentPath) || null;
  
  // Use the dependencies hook
  const {
    canAccessStep,
    resolveNextStep,
    availableNextSteps
  } = useTourDependencies(currentPath, availablePaths, visibleSteps, completedStepIds);
  
  // Get the current step data
  const currentStepData = visibleSteps[currentStep] || null;
  
  // Navigate to the next step with dependency awareness
  const nextStep = useCallback(() => {
    if (!currentStepData || !currentPathData) return;
    
    // Track the current step interaction as "completed"
    analytics.trackStepInteraction(
      currentPathData,
      currentStepData,
      currentStep,
      'completed',
      userId,
      userType
    );
    
    // Check if this step has branching logic
    const branchTargetId = resolveNextStep(currentStepData.id);
    
    if (branchTargetId) {
      // If branch target is found, find its index and navigate to it
      const branchTargetIndex = visibleSteps.findIndex(step => step.id === branchTargetId);
      if (branchTargetIndex >= 0) {
        setCurrentStep(branchTargetIndex);
        return;
      }
    }
    
    // Standard next step navigation with dependency check
    if (currentStep < visibleSteps.length - 1) {
      // Find the next accessible step
      let nextStepIndex = currentStep + 1;
      
      // If the immediate next step isn't accessible, look for the next one that is
      while (
        nextStepIndex < visibleSteps.length && 
        !canAccessStep(visibleSteps[nextStepIndex].id)
      ) {
        nextStepIndex++;
      }
      
      // If we found an accessible step, go to it
      if (nextStepIndex < visibleSteps.length) {
        setCurrentStep(nextStepIndex);
      }
    }
  }, [
    currentStepData,
    currentPathData,
    currentStep,
    visibleSteps,
    resolveNextStep,
    canAccessStep,
    setCurrentStep,
    analytics,
    userId,
    userType
  ]);
  
  // Navigate to the previous step with dependency awareness
  const prevStep = useCallback(() => {
    if (!currentStepData || !currentPathData || currentStep <= 0) return;
    
    // Track going back
    analytics.trackStepInteraction(
      currentPathData,
      currentStepData,
      currentStep,
      'go_back',
      userId,
      userType
    );
    
    // Find the previous accessible step
    let prevStepIndex = currentStep - 1;
    
    // If the immediate previous step isn't accessible, look for the previous one that is
    while (prevStepIndex >= 0 && !canAccessStep(visibleSteps[prevStepIndex].id)) {
      prevStepIndex--;
    }
    
    // If we found an accessible step, go to it
    if (prevStepIndex >= 0) {
      setCurrentStep(prevStepIndex);
    }
  }, [
    currentStepData,
    currentPathData,
    currentStep,
    visibleSteps,
    canAccessStep,
    setCurrentStep,
    analytics,
    userId,
    userType
  ]);
  
  // Go to a specific step with dependency check
  const goToStep = useCallback((stepIndex: number) => {
    if (
      !currentPathData || 
      stepIndex < 0 || 
      stepIndex >= visibleSteps.length || 
      !canAccessStep(visibleSteps[stepIndex].id)
    ) {
      return;
    }
    
    // Track jumping to a specific step
    if (currentStepData) {
      analytics.trackStepInteraction(
        currentPathData,
        currentStepData,
        currentStep,
        `jump_to_step_${stepIndex}`,
        userId,
        userType
      );
    }
    
    setCurrentStep(stepIndex);
  }, [
    currentPathData,
    currentStepData,
    currentStep,
    visibleSteps,
    canAccessStep,
    setCurrentStep,
    analytics,
    userId,
    userType
  ]);
  
  // Get suggested next steps based on dependencies
  const getSuggestedNextSteps = useCallback(() => {
    return availableNextSteps.slice(0, 3); // Limit to top 3 suggestions
  }, [availableNextSteps]);
  
  return {
    nextStep,
    prevStep,
    goToStep,
    getSuggestedNextSteps,
    canAccessStep
  };
}
