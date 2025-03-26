
import React, { useEffect } from "react";
import { useTour } from "@/contexts/tour";
import { useTourCompletionTracker } from "@/hooks/tour/useTourCompletionTracker";

export const TourAnalyticsTracker: React.FC = () => {
  const { isActive, currentStep, totalSteps, currentPath } = useTour();
  
  // Track tour completion and analytics
  useTourCompletionTracker(isActive, currentStep, totalSteps, currentPath);
  
  return null;
};
