
/**
 * Type for condition evaluator functions
 */
export type ConditionEvaluator = () => boolean;

/**
 * Type for tour analytics event data
 */
export interface TourAnalyticsEvent {
  pathId: string;
  pathName: string;
  stepId: string;
  stepIndex: number;
  totalSteps: number;
  userId?: string;
  userType?: string;
  event: string;
  timestamp: number;
  metadata?: Record<string, any>;
}
