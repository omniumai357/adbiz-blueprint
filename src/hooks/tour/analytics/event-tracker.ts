
import { TourAnalyticsEvent, TourAnalyticsData } from './types';
import { storeAnalyticsData } from './storage-service';
import { TourPath, TourStep } from '@/contexts/tour-context';

/**
 * Track a tour analytics event
 * @param event The type of event to track
 * @param data Additional data about the event
 */
export const trackEvent = (
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
  
  // Store the analytics data
  storeAnalyticsData(analyticsData);
};

/**
 * Track when a tour is started
 */
export const trackTourStarted = (
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
};

/**
 * Track when a tour is completed
 */
export const trackTourCompleted = (
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
};

/**
 * Track when a tour is abandoned
 */
export const trackTourAbandoned = (
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
};

/**
 * Track when a step is viewed
 */
export const trackStepViewed = (
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
};

/**
 * Track when a step is skipped
 */
export const trackStepSkipped = (
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
};

/**
 * Track when a user interacts with a step
 */
export const trackStepInteraction = (
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
};
