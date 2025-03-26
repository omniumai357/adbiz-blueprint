
import { useCallback } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';

/**
 * Event types that can be tracked during a tour
 */
export type TourAnalyticsEvent = 
  | 'tour_started'
  | 'tour_completed' 
  | 'tour_abandoned'
  | 'step_viewed'
  | 'step_skipped'
  | 'step_interaction';

/**
 * Analytics data for tour events
 */
export interface TourAnalyticsData {
  event: TourAnalyticsEvent;
  pathId: string;
  pathName: string;
  stepId?: string;
  stepIndex?: number;
  totalSteps?: number;
  userId?: string;
  userType?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Hook for tracking tour analytics
 */
export function useTourAnalytics() {
  /**
   * Track a tour analytics event
   * @param event The type of event to track
   * @param data Additional data about the event
   */
  const trackEvent = useCallback((
    event: TourAnalyticsEvent,
    data: Omit<TourAnalyticsData, 'event' | 'timestamp'>
  ) => {
    // Create the full analytics data object
    const analyticsData: TourAnalyticsData = {
      ...data,
      event,
      timestamp: Date.now(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Tour Analytics:', analyticsData);
    }
    
    // In a real implementation, this would send data to an analytics service
    // This could be Google Analytics, Mixpanel, a custom backend, etc.
    sendToAnalyticsService(analyticsData);
  }, []);

  /**
   * Track when a tour is started
   */
  const trackTourStarted = useCallback((
    tourPath: TourPath,
    userId?: string,
    userType?: string
  ) => {
    trackEvent('tour_started', {
      pathId: tourPath.id,
      pathName: tourPath.name,
      totalSteps: tourPath.steps.length,
      userId,
      userType,
    });
  }, [trackEvent]);

  /**
   * Track when a tour is completed
   */
  const trackTourCompleted = useCallback((
    tourPath: TourPath,
    userId?: string,
    userType?: string,
    metadata?: Record<string, any>
  ) => {
    trackEvent('tour_completed', {
      pathId: tourPath.id,
      pathName: tourPath.name,
      totalSteps: tourPath.steps.length,
      userId,
      userType,
      metadata,
    });
  }, [trackEvent]);

  /**
   * Track when a tour is abandoned
   */
  const trackTourAbandoned = useCallback((
    tourPath: TourPath,
    stepIndex: number,
    userId?: string,
    userType?: string
  ) => {
    trackEvent('tour_abandoned', {
      pathId: tourPath.id,
      pathName: tourPath.name,
      stepIndex,
      totalSteps: tourPath.steps.length,
      userId,
      userType,
    });
  }, [trackEvent]);

  /**
   * Track when a step is viewed
   */
  const trackStepViewed = useCallback((
    tourPath: TourPath,
    step: TourStep,
    stepIndex: number,
    userId?: string,
    userType?: string
  ) => {
    trackEvent('step_viewed', {
      pathId: tourPath.id,
      pathName: tourPath.name,
      stepId: step.id,
      stepIndex,
      totalSteps: tourPath.steps.length,
      userId,
      userType,
    });
  }, [trackEvent]);

  /**
   * Track when a step is skipped
   */
  const trackStepSkipped = useCallback((
    tourPath: TourPath,
    step: TourStep,
    stepIndex: number,
    userId?: string,
    userType?: string
  ) => {
    trackEvent('step_skipped', {
      pathId: tourPath.id,
      pathName: tourPath.name,
      stepId: step.id,
      stepIndex,
      totalSteps: tourPath.steps.length,
      userId,
      userType,
    });
  }, [trackEvent]);

  /**
   * Track when a user interacts with a step
   */
  const trackStepInteraction = useCallback((
    tourPath: TourPath,
    step: TourStep,
    stepIndex: number,
    interactionType: string,
    userId?: string,
    userType?: string
  ) => {
    trackEvent('step_interaction', {
      pathId: tourPath.id,
      pathName: tourPath.name,
      stepId: step.id,
      stepIndex,
      totalSteps: tourPath.steps.length,
      userId,
      userType,
      metadata: { interactionType },
    });
  }, [trackEvent]);

  // Helper function to send data to the actual analytics service
  const sendToAnalyticsService = (data: TourAnalyticsData) => {
    // This is a placeholder for actual analytics service integration
    // In a real implementation, this would send data to your analytics platform
    
    // Example: sending to a backend API endpoint
    // fetch('/api/tour-analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    
    // For now, we'll just store in localStorage for demo purposes
    try {
      const existingData = localStorage.getItem('tourAnalytics');
      const analyticsArray = existingData ? JSON.parse(existingData) : [];
      analyticsArray.push(data);
      localStorage.setItem('tourAnalytics', JSON.stringify(analyticsArray));
    } catch (error) {
      console.error('Failed to store tour analytics:', error);
    }
  };

  return {
    trackTourStarted,
    trackTourCompleted,
    trackTourAbandoned,
    trackStepViewed,
    trackStepSkipped,
    trackStepInteraction,
  };
}
