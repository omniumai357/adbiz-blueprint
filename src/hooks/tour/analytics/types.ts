
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
export type TourAnalyticsData = {
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
};
