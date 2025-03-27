
import { TourStep, TourPath } from '@/contexts/tour/types';

/**
 * Data structure for tour step tracking
 */
export interface TourStepData {
  pathId: string;
  tourId: string;
  tourName: string;
  stepId: string;
  stepIndex: number;
  totalSteps: number;
  userId: string;
  userType: string;
}

/**
 * Data for tracking custom tour events
 */
export interface TourCustomEventData extends Omit<TourStepData, 'stepId' | 'stepIndex'> {
  eventType: string;
  [key: string]: any;
}

/**
 * Tour start data (minimal version)
 */
export interface TourStartData {
  pathId: string;
  tourId: string;
  tourName: string;
  userId?: string;
  userType?: string;
}

/**
 * Tour completion data
 */
export interface TourCompleteData extends TourStartData {
  totalSteps: number;
  userId: string;
  userType: string;
  metadata: Record<string, any>;
}
