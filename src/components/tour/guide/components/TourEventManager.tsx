
import React, { useEffect } from "react";
import { useTour } from "@/contexts/tour";
import { TourEventListeners } from "../../events/TourEventListeners";
import { useTourAnalytics } from "@/hooks/tour/useTourAnalytics";
import { useAuth } from "@/features/auth";

// Extend the useTourAnalytics hook result with the missing methods
interface ExtendedAnalytics extends ReturnType<typeof useTourAnalytics> {
  trackTourExited: (data: any) => boolean;
}

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
  const analytics = useTourAnalytics() as ExtendedAnalytics;
  
  // Track completion or exit events
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isActive && currentStepData && currentPathData && currentPath) {
        analytics.trackTourExited({
          pathId: currentPathData.id,
          tourId: currentPathData.id,
          tourName: currentPathData.name || '',
          stepId: currentStepData.id,
          stepIndex: currentStep,
          totalSteps: currentPathData.steps.length,
          reason: "page_unload",
          userId: user?.id || '',
          userType: user?.type || ''
        });
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
