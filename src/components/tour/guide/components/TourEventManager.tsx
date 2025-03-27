
import React, { useEffect } from "react";
import { useTour } from "@/contexts/tour";
import { TourEventListeners } from "../../events/TourEventListeners";
import { useTourAnalytics } from "@/hooks/tour/useTourAnalytics";
import { useAuth } from "@/features/auth";

export const TourEventManager: React.FC = () => {
  const {
    isActive,
    currentStep,
    currentStepData,
    currentPath,
    currentPathData,
    nextStep,
    prevStep,
    endTour
  } = useTour();
  
  const { user } = useAuth();
  const analytics = useTourAnalytics();
  
  // Track completion or exit events
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isActive && currentStepData && currentPathData && currentPath) {
        analytics.trackTourExit(
          currentPathData, 
          currentStepData, 
          currentStep,
          "page_unload",
          user?.id, 
          user?.type
        );
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isActive, currentStep, currentStepData, currentPath, currentPathData, analytics, user?.id, user?.type]);

  if (!isActive) {
    return null;
  }

  return (
    <TourEventListeners 
      handleNext={nextStep}
      handlePrev={prevStep}
      handleClose={endTour}
    />
  );
};
