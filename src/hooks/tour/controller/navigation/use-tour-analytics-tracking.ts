
import { useCallback } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Hook that handles analytics tracking for tour navigation
 */
export function useTourAnalyticsTracking(
  trackStepInteraction: (
    pathData: TourPath,
    stepData: TourStep,
    stepIndex: number,
    interactionType: string,
    userId?: string,
    userType?: string
  ) => void
) {
  // Track completion of a step
  const trackStepCompletion = useCallback((
    pathData: TourPath,
    stepData: TourStep,
    stepIndex: number,
    userId?: string,
    userType?: string
  ) => {
    trackStepInteraction(
      pathData, 
      stepData, 
      stepIndex, 
      'completed',
      userId,
      userType
    );
  }, [trackStepInteraction]);
  
  // Track going back to previous step
  const trackStepGoBack = useCallback((
    pathData: TourPath,
    stepData: TourStep,
    stepIndex: number,
    userId?: string,
    userType?: string
  ) => {
    trackStepInteraction(
      pathData, 
      stepData, 
      stepIndex, 
      'go_back',
      userId,
      userType
    );
  }, [trackStepInteraction]);
  
  // Track jumping to a specific step
  const trackStepJump = useCallback((
    pathData: TourPath,
    stepData: TourStep,
    fromStepIndex: number,
    toStepIndex: number,
    userId?: string,
    userType?: string
  ) => {
    trackStepInteraction(
      pathData, 
      stepData, 
      fromStepIndex, 
      `jump_to_step_${toStepIndex}`,
      userId,
      userType
    );
  }, [trackStepInteraction]);
  
  return {
    trackStepCompletion,
    trackStepGoBack,
    trackStepJump
  };
}
