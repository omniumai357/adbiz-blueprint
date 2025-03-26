
import { useCallback } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';
import { useTourAnalytics } from '../../useTourAnalytics';
import { useTourDependencies } from '../dependency/use-tour-dependencies';
import { useTourDependencyNavigation } from './use-tour-dependency-navigation';
import { useTourAnalyticsTracking } from './use-tour-analytics-tracking';

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
  
  // Use the dependency navigation hook
  const {
    findNextAccessibleStep,
    findPrevAccessibleStep,
    tryNavigateToBranch
  } = useTourDependencyNavigation(
    visibleSteps, 
    currentStep, 
    canAccessStep, 
    resolveNextStep, 
    setCurrentStep
  );
  
  // Use the analytics tracking hook
  const {
    trackStepCompletion,
    trackStepGoBack,
    trackStepJump
  } = useTourAnalyticsTracking(analytics.trackStepInteraction);
  
  // Navigate to the next step with dependency awareness
  const nextStep = useCallback(() => {
    if (!currentStepData || !currentPathData) return;
    
    // Track the current step interaction as "completed"
    trackStepCompletion(
      currentPathData,
      currentStepData,
      currentStep,
      userId,
      userType
    );
    
    // Check if this step has branching logic
    if (tryNavigateToBranch(currentStepData.id)) {
      return; // Navigation handled by tryNavigateToBranch
    }
    
    // Find the next accessible step
    const nextStepIndex = findNextAccessibleStep();
    
    // If we found an accessible step, go to it
    if (nextStepIndex >= 0) {
      setCurrentStep(nextStepIndex);
    }
  }, [
    currentStepData,
    currentPathData,
    currentStep,
    trackStepCompletion,
    tryNavigateToBranch,
    findNextAccessibleStep,
    setCurrentStep,
    userId,
    userType
  ]);
  
  // Navigate to the previous step with dependency awareness
  const prevStep = useCallback(() => {
    if (!currentStepData || !currentPathData) return;
    
    // Track going back
    trackStepGoBack(
      currentPathData,
      currentStepData,
      currentStep,
      userId,
      userType
    );
    
    // Find the previous accessible step
    const prevStepIndex = findPrevAccessibleStep();
    
    // If we found an accessible step, go to it
    if (prevStepIndex >= 0) {
      setCurrentStep(prevStepIndex);
    }
  }, [
    currentStepData,
    currentPathData,
    currentStep,
    trackStepGoBack,
    findPrevAccessibleStep,
    setCurrentStep,
    userId,
    userType
  ]);
  
  // Go to a specific step with dependency check
  const goToStep = useCallback((stepIndex: number) => {
    if (
      !currentPathData || 
      !currentStepData ||
      stepIndex < 0 || 
      stepIndex >= visibleSteps.length || 
      !canAccessStep(visibleSteps[stepIndex].id)
    ) {
      return;
    }
    
    // Track jumping to a specific step
    trackStepJump(
      currentPathData,
      currentStepData,
      currentStep,
      stepIndex,
      userId,
      userType
    );
    
    setCurrentStep(stepIndex);
  }, [
    currentPathData,
    currentStepData,
    currentStep,
    visibleSteps,
    canAccessStep,
    trackStepJump,
    setCurrentStep,
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
