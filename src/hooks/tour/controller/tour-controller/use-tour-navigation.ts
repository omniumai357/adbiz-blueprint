
import { useCallback } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { getCurrentStepData } from '../step-processor';

/**
 * Hook for tour navigation logic
 */
export function useTourNavigation(
  currentStep: number,
  visibleSteps: TourStep[],
  setCurrentStep: (step: number) => void,
  getCurrentPathData: () => TourPath | undefined,
  trackStepSkipped: (
    pathData: TourPath,
    currentStepData: TourStep,
    currentStep: number,
    userId?: string,
    userType?: string
  ) => void,
  trackStepInteraction: (
    pathData: TourPath,
    currentStepData: TourStep,
    currentStep: number,
    interactionType: string,
    userId?: string,
    userType?: string
  ) => void,
  endTour: () => void,
  userId?: string,
  userType?: string
) {
  // Go to next step
  const nextStep = useCallback(() => {
    const pathData = getCurrentPathData();
    
    if (pathData && visibleSteps.length > 0) {
      // If current step is NOT the last step
      if (currentStep < visibleSteps.length - 1) {
        // Track the user skipping the current step
        const currentStepData = visibleSteps[currentStep];
        trackStepSkipped(pathData, currentStepData, currentStep, userId, userType);
        
        // Move to next step
        setCurrentStep(currentStep + 1);
      } else {
        // End the tour if we're on the last step
        endTour();
      }
    }
  }, [visibleSteps, currentStep, endTour, getCurrentPathData, trackStepSkipped, userId, userType, setCurrentStep]);

  // Go to previous step
  const prevStep = useCallback(() => {
    const pathData = getCurrentPathData();
    
    if (pathData && currentStep > 0) {
      // Track going back to the previous step
      const currentStepData = visibleSteps[currentStep];
      trackStepInteraction(
        pathData, 
        currentStepData, 
        currentStep, 
        'go_back', 
        userId, 
        userType
      );
      
      // Move to previous step
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, getCurrentPathData, visibleSteps, trackStepInteraction, userId, userType, setCurrentStep]);

  // Go to specific step
  const goToStep = useCallback((stepIndex: number) => {
    const pathData = getCurrentPathData();
    
    if (pathData && visibleSteps.length > 0 && stepIndex >= 0 && stepIndex < visibleSteps.length) {
      // Track jumping to a specific step
      const currentStepData = visibleSteps[currentStep];
      
      trackStepInteraction(
        pathData, 
        currentStepData, 
        currentStep, 
        `jump_to_step_${stepIndex}`, 
        userId, 
        userType
      );
      
      // Set the new step
      setCurrentStep(stepIndex);
    }
  }, [visibleSteps, currentStep, getCurrentPathData, trackStepInteraction, userId, userType, setCurrentStep]);

  // Get current step data
  const getStepData = useCallback((): TourStep | null => {
    return getCurrentStepData(visibleSteps, currentStep);
  }, [visibleSteps, currentStep]);

  // Get total steps count
  const getTotalSteps = useCallback((): number => {
    return visibleSteps.length || 0;
  }, [visibleSteps]);

  return {
    nextStep,
    prevStep,
    goToStep,
    getStepData,
    getTotalSteps
  };
}
