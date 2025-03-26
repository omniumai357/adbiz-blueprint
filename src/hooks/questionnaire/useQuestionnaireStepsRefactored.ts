
import { useFormSteps } from "@/patterns/state-management";

/**
 * Constants for questionnaire steps
 */
export const QUESTIONNAIRE_STEPS = {
  BUSINESS_INFO: 1,
  BRANDING_CONTACT: 2,
  MARKETING_GOALS: 3,
  FILE_UPLOAD: 4,
  REVIEW: 5,
  TOTAL_STEPS: 5
};

/**
 * Hook for managing questionnaire step navigation with validation
 * Uses the reusable useFormSteps pattern
 */
export function useQuestionnaireStepsRefactored() {
  const steps = useFormSteps(QUESTIONNAIRE_STEPS.BUSINESS_INFO, QUESTIONNAIRE_STEPS.TOTAL_STEPS);
  
  // Additional questionnaire-specific state
  const [reviewMode, setReviewMode] = useState(false);
  
  /**
   * Advances to the next step if validation passes
   */
  const nextStepWithValidation = (isValid: boolean) => {
    if (isValid) {
      steps.markStepComplete(steps.currentStep);
      steps.nextStep();
      return true;
    }
    return false;
  };
  
  /**
   * Enables review mode to show all form sections
   */
  const showReview = () => {
    setReviewMode(true);
  };
  
  /**
   * Exits review mode
   */
  const exitReview = () => {
    setReviewMode(false);
  };
  
  /**
   * Jump to a specific step if it's already completed or adjacent to current
   */
  const jumpToStep = (step: number) => {
    const canJump = steps.isStepComplete(step) || 
                   step === steps.currentStep + 1 || 
                   step === steps.currentStep - 1;
                   
    if (canJump) {
      steps.goToStep(step);
      return true;
    }
    return false;
  };
  
  return {
    ...steps,
    reviewMode,
    showReview,
    exitReview,
    nextStepWithValidation,
    jumpToStep,
    // Helper getters for step names
    isBusinessInfoStep: steps.currentStep === QUESTIONNAIRE_STEPS.BUSINESS_INFO,
    isBrandingContactStep: steps.currentStep === QUESTIONNAIRE_STEPS.BRANDING_CONTACT,
    isMarketingGoalsStep: steps.currentStep === QUESTIONNAIRE_STEPS.MARKETING_GOALS,
    isFileUploadStep: steps.currentStep === QUESTIONNAIRE_STEPS.FILE_UPLOAD,
    isReviewStep: steps.currentStep === QUESTIONNAIRE_STEPS.REVIEW
  };
}

// Need to import useState
import { useState } from 'react';
