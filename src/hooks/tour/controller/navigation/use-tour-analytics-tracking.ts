
import { useCallback } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Custom hook for tracking tour analytics events
 */
export const useTourAnalyticsTracking = (
  currentPathData: TourPath | undefined,
  currentStepData: TourStep | null,
  currentStep: number,
  userId?: string,
  userType?: string
) => {
  /**
   * Track navigation interactions for analytics
   */
  const trackNavigation = useCallback((interactionType: string) => {
    if (!currentPathData || !currentStepData) return;
    
    try {
      // Log the interaction for analytics or debugging
      console.log(`Tour interaction: ${interactionType}`, {
        tourId: currentPathData.id,
        stepId: currentStepData.id,
        stepIndex: currentStep,
        userId,
        userType
      });
      
      // Here you would typically send this data to your analytics service
      // This is a placeholder for actual analytics implementation
    } catch (error) {
      console.error('Error tracking tour navigation:', error);
    }
  }, [currentPathData, currentStepData, currentStep, userId, userType]);
  
  /**
   * Enhanced analytics tracking object with specific events
   */
  const tourAnalytics = {
    trackStepCompletion: useCallback((
      pathData: TourPath, 
      stepData: TourStep, 
      stepIndex: number,
      userId?: string,
      userType?: string
    ) => {
      console.log('Tour step completed', {
        tourId: pathData.id,
        stepId: stepData.id,
        stepIndex,
        userId,
        userType
      });
    }, []),
    
    trackStepGoBack: useCallback((
      pathData: TourPath, 
      stepData: TourStep, 
      stepIndex: number,
      userId?: string,
      userType?: string
    ) => {
      console.log('Tour step back', {
        tourId: pathData.id,
        stepId: stepData.id,
        stepIndex,
        userId,
        userType
      });
    }, []),
    
    trackStepJump: useCallback((
      pathData: TourPath, 
      stepData: TourStep, 
      fromStepIndex: number,
      toStepIndex: number,
      userId?: string,
      userType?: string
    ) => {
      console.log('Tour step jump', {
        tourId: pathData.id,
        stepId: stepData.id,
        fromStepIndex,
        toStepIndex,
        userId,
        userType
      });
    }, []),
    
    trackTourStart: useCallback((
      pathData: TourPath,
      userId?: string,
      userType?: string
    ) => {
      console.log('Tour started', {
        tourId: pathData.id,
        userId,
        userType
      });
    }, []),
    
    trackTourComplete: useCallback((
      pathData: TourPath,
      userId?: string,
      userType?: string
    ) => {
      console.log('Tour completed', {
        tourId: pathData.id,
        userId,
        userType
      });
    }, []),
    
    trackTourSkip: useCallback((
      pathData: TourPath,
      stepData: TourStep,
      stepIndex: number,
      userId?: string,
      userType?: string
    ) => {
      console.log('Tour skipped', {
        tourId: pathData.id,
        stepId: stepData.id,
        stepIndex,
        userId,
        userType
      });
    }, [])
  };
  
  return { trackNavigation, tourAnalytics };
};
