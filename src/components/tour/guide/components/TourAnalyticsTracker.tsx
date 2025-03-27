
import React, { useEffect } from "react";
import { useTour } from "@/contexts/tour";
import { useTourAnalytics } from "@/hooks/tour/useTourAnalytics";
import { useAuth } from "@/features/auth";

export const TourAnalyticsTracker: React.FC = () => {
  const {
    isActive,
    currentStep,
    currentStepData,
    currentPath,
    currentPathData,
  } = useTour();
  
  const { user } = useAuth();
  const analytics = useTourAnalytics();
  
  // Track tour view and step impression
  useEffect(() => {
    if (isActive && currentStepData && currentPathData && currentPath) {
      // Track tour view when it first becomes active
      analytics.trackTourView(currentPathData, user?.id, user?.type);
      
      // Track step impression
      analytics.trackStepImpression(
        currentPathData, 
        currentStepData, 
        currentStep, 
        user?.id, 
        user?.type
      );
    }
  }, [isActive, currentStep, currentStepData, currentPath, currentPathData, analytics, user?.id, user?.type]);

  return null;
};
