
import { useState } from "react";

/**
 * Custom hook to manage questionnaire steps and navigation
 * 
 * Provides state and methods for step-by-step form progression,
 * including review mode functionality.
 * 
 * @param {number} initialStep - The initial step to display (defaults to 1)
 * @returns {Object} Step management state and handlers
 */
export function useQuestionnaireSteps(initialStep = 1) {
  const [step, setStep] = useState(initialStep);
  const [showReview, setShowReview] = useState(false);
  
  /**
   * Advance to the next step, optionally validating the current step first
   * @param {Function} [validateFn] - Optional validation function that returns boolean
   */
  const nextStep = (validateFn?: () => boolean) => {
    if (validateFn && !validateFn()) {
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };
  
  /**
   * Go back to the previous step
   */
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  /**
   * Show the review screen with all form data
   */
  const onShowReview = () => {
    setShowReview(true);
  };
  
  return {
    step,
    showReview,
    nextStep,
    prevStep,
    onShowReview
  };
}
