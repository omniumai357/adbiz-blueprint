import { useCallback } from 'react';
import { 
  trackTourStarted, 
  trackTourCompleted, 
  trackTourAbandoned, 
  trackStepViewed, 
  trackStepSkipped, 
  trackStepInteraction 
} from './analytics/event-tracker';
import { TourAnalyticsEvent, TourAnalyticsData } from './analytics/types';
import { 
  loadAnalyticsData as loadData, 
  clearAnalyticsData as clearData 
} from './analytics/storage-service';
import { 
  exportAnalyticsAsCsv, 
  exportAnalyticsAsJson 
} from './analytics/export-utils';

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

  return {
    // Event tracking functions
    trackTourStarted,
    trackTourCompleted,
    trackTourAbandoned,
    trackStepViewed,
    trackStepSkipped,
    trackStepInteraction,
    
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
