
import { useCallback } from "react";
import { TourPath, TourStep } from "@/contexts/tour-context";
import { useTourAnalytics } from "../../useTourAnalytics";
import { useButtonInteractions } from "./use-button-interactions";

/**
 * Hook to handle tour interactions with analytics tracking
 * 
 * @param currentStepData Current step data
 * @param currentPath Current tour path ID
 * @param availablePaths Available tour paths
 * @param currentStep Current step index
 * @param userId User ID for analytics
 * @param userType User type for analytics
 * @param handlers Object containing handler functions
 * @returns Object containing interaction handler functions
 */
export function useTourInteractions(
  currentStepData: TourStep | null,
  currentPath: string | null,
  availablePaths: TourPath[],
  currentStep: number,
  userId: string | undefined,
  userType: string | undefined,
  handlers: {
    nextStep: () => void;
    prevStep: () => void;
    endTour: () => void;
  }
) {
  const { nextStep, prevStep, endTour } = handlers;
  const analytics = useTourAnalytics();
  
  // Get the current path data
  const pathData = availablePaths.find(path => path.id === currentPath);
  
  // Use the button interactions hook
  const buttonInteractions = useButtonInteractions(
    currentStepData,
    pathData,
    currentStep,
    userId,
    userType,
    analytics.trackStepInteraction,
    { nextStep, prevStep, endTour }
  );

  return buttonInteractions;
}
