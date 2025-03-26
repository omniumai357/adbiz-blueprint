
import { useState, useCallback } from 'react';

/**
 * Creates a hook for managing form step navigation
 * 
 * @param initialStep Initial step number
 * @param totalSteps Total number of steps
 * @returns Object with step navigation state and functions
 */
export function useFormSteps(initialStep: number = 1, totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);
  
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(s => s + 1);
      return true;
    }
    return false;
  }, [currentStep, totalSteps, completedSteps]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
      return true;
    }
    return false;
  }, [currentStep]);
  
  const markStepComplete = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps && !completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  }, [totalSteps, completedSteps]);
  
  const isStepComplete = useCallback((step: number) => {
    return completedSteps.includes(step);
  }, [completedSteps]);
  
  return {
    currentStep,
    completedSteps,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    goToStep,
    nextStep,
    prevStep,
    markStepComplete,
    isStepComplete,
    progress: (completedSteps.length / totalSteps) * 100
  };
}
