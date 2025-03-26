
import React from "react";
import { useTour } from "@/contexts/tour";
import { useTourCompletionTracker } from "@/hooks/tour/useTourCompletionTracker";

export const TourAnalyticsTracker: React.FC = () => {
  const { isActive, currentStep, totalSteps, currentPath } = useTour();
  
  // Ensure values are defined before passing to hook
  const isActiveSafe = isActive || false;
  const currentStepSafe = currentStep || 0;
  const totalStepsSafe = totalSteps || 0;
  const currentPathSafe = currentPath || null;
  
  // Track tour completion and analytics
  useTourCompletionTracker(isActiveSafe, currentStepSafe, totalStepsSafe, currentPathSafe);
  
  return null;
};
