
import { 
  loadAnalyticsData, 
  clearAnalyticsData 
} from '@/hooks/tour/analytics/storage-service';
import { 
  exportAnalyticsAsCsv, 
  exportAnalyticsAsJson 
} from '@/hooks/tour/analytics/export-utils';
import { TourAnalyticsData } from '@/hooks/tour/analytics/types';

// Re-export the functions for backward compatibility
export { 
  loadAnalyticsData, 
  clearAnalyticsData,
  exportAnalyticsAsCsv as exportTourAnalyticsAsCsv,
  exportAnalyticsAsJson as exportTourAnalyticsAsJson
};

// Include the type for backward compatibility
export type { TourAnalyticsData };
