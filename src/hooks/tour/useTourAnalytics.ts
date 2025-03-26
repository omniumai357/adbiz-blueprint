
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

  return {
    // Event tracking functions
    trackTourStarted,
    trackTourCompleted,
    trackTourExited,
    trackStepViewed,
    trackStepSkipped,
    trackInteraction,
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
