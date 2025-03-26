
import { useCallback } from "react";
import { TourPath, TourStep } from "@/contexts/tour-context";

/**
 * Hook to handle user click interactions with tour elements
 */
export function useClickInteractions(
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
) {
  // Track a specific interaction type
  const handleInteraction = useCallback((interactionType: string) => {
    if (!currentStepData || !pathData) return;
    
    trackInteraction(
      pathData,
      currentStepData,
      currentStep,
      interactionType,
      userId,
      userType
    );
  }, [currentStepData, pathData, trackInteraction, currentStep, userId, userType]);

  return { handleInteraction };
}
