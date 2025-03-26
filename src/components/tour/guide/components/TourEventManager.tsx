
import React from "react";
import { useTour } from "@/contexts/tour";
import { useTourInteractions } from "@/hooks/tour/useTourInteractions";
import { useUserContext } from "@/hooks/tour/useUserContext";
import { TourEventListeners } from "../../events/TourEventListeners";

export const TourEventManager: React.FC = () => {
  const {
    currentStepData,
    currentPath,
    availablePaths,
    currentStep,
    nextStep,
    prevStep,
    endTour
  } = useTour();
  
  const { userId, userType } = useUserContext();
  
  // Get current path ID safely
  const currentPathId = currentPath ? currentPath.id : null;
  
  const { handleNext, handlePrev, handleClose } = useTourInteractions(
    currentStepData,
    currentPathId,
    availablePaths,
    currentStep,
    userId,
    userType,
    { nextStep, prevStep, endTour }
  );
  
  return (
    <TourEventListeners 
      handleNext={handleNext}
      handlePrev={handlePrev}
      handleClose={handleClose}
    />
  );
};
