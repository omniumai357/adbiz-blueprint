
import { useCallback } from 'react';
import { 
  trackTourStarted, 
  trackTourCompleted, 
  trackTourExited,
  trackStepViewed, 
  trackInteraction,
  trackStepSkipped,
  trackStepInteraction
} from './analytics/event-tracker';
import { TourAnalyticsEvent, TourAnalyticsData } from './analytics/types';
import { 
  loadAnalyticsData as loadData, 
  clearAnalyticsData as clearData 
} from './analytics/storage-service';

// Import these later when implemented
const exportAnalyticsAsCsv = () => {
  console.warn('exportAnalyticsAsCsv not implemented yet');
};

const exportAnalyticsAsJson = () => {
  console.warn('exportAnalyticsAsJson not implemented yet');
};

/**
 * Hook for tracking tour analytics
 */
export function useTourAnalytics() {
  /**
   * Load analytics data
   */
  const loadAnalyticsData = useCallback(() => {
    return loadData();
  }, []);

  /**
   * Clear analytics data
   */
  const clearAnalyticsData = useCallback(() => {
    return clearData();
  }, []);

  /**
   * Track tour view (when a tour is first displayed)
   */
  const trackTourView = useCallback((pathData: any, userId?: string, userType?: string) => {
    console.log('Tour viewed:', pathData.id, userId, userType);
    return trackTourStarted({
      pathId: pathData.id,
      tourId: pathData.id,
      tourName: pathData.name || '',
      userId: userId || '',
      userType: userType || ''
    });
  }, []);

  /**
   * Track step impression
   */
  const trackStepImpression = useCallback((
    pathData: any, 
    stepData: any, 
    stepIndex: number, 
    userId?: string, 
    userType?: string
  ) => {
    console.log('Step impression:', pathData.id, stepData.id, stepIndex, userId, userType);
    return trackStepViewed({
      pathId: pathData.id,
      tourId: pathData.id,
      tourName: pathData.name || '',
      stepId: stepData.id,
      stepIndex,
      totalSteps: pathData.steps.length,
      userId: userId || '',
      userType: userType || ''
    });
  }, []);

  return {
    // Event tracking functions
    trackTourStarted,
    trackTourCompleted,
    trackTourExited,
    trackStepViewed,
    trackStepSkipped,
    trackInteraction,
    trackStepInteraction,
    
    // Additional helper methods
    trackTourView,
    trackStepImpression,
    
    // Data management functions
    loadAnalyticsData,
    clearAnalyticsData,
    
    // Export functions
    exportAnalyticsAsCsv,
    exportAnalyticsAsJson
  };
}

// Re-export types for convenience
export type { TourAnalyticsEvent, TourAnalyticsData };
