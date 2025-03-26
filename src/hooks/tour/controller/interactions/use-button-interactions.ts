
import { useCallback } from "react";
import { TourStep, TourPath } from "@/contexts/tour-context";
import { useClickInteractions } from "./use-click-interactions";
import { useActionHandling } from "./use-action-handling";

/**
 * Hook to handle tour button interactions with analytics tracking
 */
export function useButtonInteractions(
  currentStepData: TourStep | null,
  pathData: TourPath | undefined,
  currentStep: number,
  userId: string | undefined,
  userType: string | undefined,
  trackInteraction: (
    pathData: TourPath,
    currentStepData: TourStep,
    currentStep: number,
    interactionType: string,
    userId?: string,
    userType?: string
  ) => void,
  navigationHandlers: {
    nextStep: () => void;
    prevStep: () => void;
    endTour: () => void;
  }
) {
  const { handleInteraction } = useClickInteractions(
    currentStepData, 
    pathData, 
    currentStep, 
    userId,
    userType,
    trackInteraction
  );
  
  const { executeStepAction } = useActionHandling(currentStepData);
  
  // Handle close/skip button click
  const handleClose = useCallback(() => {
    handleInteraction('close_button_clicked');
    executeStepAction('skip');
    navigationHandlers.endTour();
  }, [handleInteraction, executeStepAction, navigationHandlers.endTour]);
  
  // Handle next button click
  const handleNext = useCallback(() => {
    handleInteraction('next_button_clicked');
    executeStepAction('next');
    navigationHandlers.nextStep();
  }, [handleInteraction, executeStepAction, navigationHandlers.nextStep]);
  
  // Handle previous button click
  const handlePrev = useCallback(() => {
    handleInteraction('prev_button_clicked');
    executeStepAction('prev');
    navigationHandlers.prevStep();
  }, [handleInteraction, executeStepAction, navigationHandlers.prevStep]);

  return {
    handleClose,
    handleNext,
    handlePrev
  };
}
