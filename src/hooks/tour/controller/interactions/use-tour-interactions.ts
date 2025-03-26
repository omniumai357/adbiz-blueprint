
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
  
  // Handle navigation actions (used by keyboard shortcuts)
  const handleNavigationAction = useCallback((
    event: React.KeyboardEvent | KeyboardEvent, 
    action: 'next' | 'previous' | 'first' | 'last' | 'close' | 'jump_forward' | 'jump_backward' | 'show_shortcuts_help'
  ) => {
    event.preventDefault();
    
    switch (action) {
      case 'next':
        buttonInteractions.handleNext();
        break;
      case 'previous':
        buttonInteractions.handlePrev();
        break;
      case 'first':
        // Logic to go to first step
        if (pathData) {
          analytics.trackStepInteraction(pathData, currentStepData, currentStep, 'jump_to_first', userId, userType);
        }
        // Implementation would go here
        break;
      case 'last':
        // Logic to go to last step
        if (pathData) {
          analytics.trackStepInteraction(pathData, currentStepData, currentStep, 'jump_to_last', userId, userType);
        }
        // Implementation would go here
        break;
      case 'jump_forward':
        // Logic to jump forward multiple steps
        if (pathData) {
          analytics.trackStepInteraction(pathData, currentStepData, currentStep, 'jump_forward', userId, userType);
        }
        // Implementation would go here
        break;
      case 'jump_backward':
        // Logic to jump backward multiple steps
        if (pathData) {
          analytics.trackStepInteraction(pathData, currentStepData, currentStep, 'jump_backward', userId, userType);
        }
        // Implementation would go here
        break;
      case 'close':
        buttonInteractions.handleClose();
        break;
      // 'show_shortcuts_help' would be handled by the component using this hook
    }
  }, [buttonInteractions, analytics, userId, userType, currentPath, currentStep, pathData, currentStepData]);

  return {
    ...buttonInteractions,
    handleNavigationAction
  };
}
