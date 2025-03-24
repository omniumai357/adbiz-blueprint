
import { useState } from "react";

export function useQuestionnaireSteps(initialStep = 1) {
  const [step, setStep] = useState(initialStep);
  const [showReview, setShowReview] = useState(false);
  
  const nextStep = (validateFn?: () => boolean) => {
    if (validateFn && !validateFn()) {
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };
  
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
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
