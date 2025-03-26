
/**
 * Type for condition evaluator functions
 */
export type ConditionEvaluator = () => boolean | Promise<boolean>;

/**
 * Type for dynamic content provider functions
 */
export type DynamicContentProvider = () => string | Promise<string>;

/**
 * Type for tour analytics event names
 */
export type TourAnalyticsEvent = 
  | 'tour_started'
  | 'tour_completed'
  | 'tour_abandoned'
  | 'step_viewed' 
  | 'step_skipped'
  | 'step_interaction';

/**
 * Type for tour analytics event data
 */
export interface TourAnalyticsData {
  pathId: string;
  pathName: string;
  stepId?: string;
  stepIndex?: number;
  totalSteps?: number;
  userId?: string;
  userType?: string;
  event: TourAnalyticsEvent;
  timestamp: number;
  metadata?: Record<string, any>;
}
