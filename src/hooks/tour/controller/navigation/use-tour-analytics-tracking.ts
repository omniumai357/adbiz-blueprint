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
  
  return trackNavigation;
};
