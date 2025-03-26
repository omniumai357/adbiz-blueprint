
import { useCallback } from "react";
import { TourPath, TourStep } from "@/contexts/tour-context";
import { useTourAnalytics } from "@/hooks/tour/useTourAnalytics";

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
  
  // Handle custom interactions with tour elements
  const handleInteraction = useCallback((interactionType: string) => {
    if (!currentStepData || !pathData) return;
    
    analytics.trackStepInteraction(
      pathData,
      currentStepData,
      currentStep,
      interactionType,
      userId,
      userType
    );
  }, [currentStepData, pathData, analytics, currentStep, userId, userType]);

  // Handle tour closing with analytics
  const handleClose = useCallback(() => {
    handleInteraction('close_button_clicked');
    
    // Check if the step has custom actions defined
    if (currentStepData?.actions?.skip?.onClick) {
      currentStepData.actions.skip.onClick();
    }
    
    endTour();
  }, [handleInteraction, currentStepData, endTour]);
  
  // Handle next step with analytics
  const handleNext = useCallback(() => {
    handleInteraction('next_button_clicked');
    
    // Check if the step has custom actions defined
    if (currentStepData?.actions?.next?.onClick) {
      currentStepData.actions.next.onClick();
    }
    
    nextStep();
  }, [handleInteraction, currentStepData, nextStep]);
  
  // Handle previous step with analytics
  const handlePrev = useCallback(() => {
    handleInteraction('prev_button_clicked');
    
    // Check if the step has custom actions defined
    if (currentStepData?.actions?.prev?.onClick) {
      currentStepData.actions.prev.onClick();
    }
    
    prevStep();
  }, [handleInteraction, currentStepData, prevStep]);

  return {
    handleClose,
    handleNext,
    handlePrev
  };
}
