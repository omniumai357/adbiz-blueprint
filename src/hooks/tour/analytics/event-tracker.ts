
import { TourAnalyticsEvent, TourAnalyticsData, TourAnalyticsEventType, TourInteractionType } from './types';
import { storeAnalyticsData } from './storage-service';
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Track a tour analytics event
 * @param event The type of event to track
 * @param data Additional data about the event
 */
export const trackEvent = (
  event: TourAnalyticsEventType,
  data: Omit<TourAnalyticsData, 'timestamp' | 'event' | 'eventType'>
) => {
  // Create the full analytics data object
  const analyticsData: TourAnalyticsData = {
    ...data,
    event: event, // For backward compatibility
    eventType: event,
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
  tourPath: TourPath | string,
  userId?: string,
  userType?: string
) => {
  const pathId = typeof tourPath === 'string' ? tourPath : tourPath.id;
  const pathName = typeof tourPath === 'string' ? pathId : (tourPath.name || tourPath.id);
  
  trackEvent('tour_started', {
    pathId: pathId,
    tourId: pathId,
    tourName: pathName,
    userId,
    userType,
  });
};

/**
 * Track when a tour is completed
 */
export const trackTourCompleted = (
  tourPath: TourPath | string,
  userId?: string,
  userType?: string,
  metadata?: Record<string, any>
) => {
  const pathId = typeof tourPath === 'string' ? tourPath : tourPath.id;
  const pathName = typeof tourPath === 'string' ? pathId : (tourPath.name || tourPath.id);
  
  trackEvent('tour_completed', {
    pathId: pathId,
    tourId: pathId,
    tourName: pathName,
    totalSteps: typeof tourPath !== 'string' ? tourPath.steps.length : undefined,
    userId,
    userType,
    metadata,
  });
};

/**
 * Track when a tour is abandoned
 */
export const trackTourAbandoned = (
  tourPath: TourPath | string,
  stepIndex: number,
  userId?: string,
  userType?: string
) => {
  const pathId = typeof tourPath === 'string' ? tourPath : tourPath.id;
  const pathName = typeof tourPath === 'string' ? pathId : (tourPath.name || tourPath.id);
  
  trackEvent('tour_abandoned', {
    pathId: pathId,
    tourId: pathId,
    tourName: pathName,
    stepIndex,
    totalSteps: typeof tourPath !== 'string' ? tourPath.steps.length : undefined,
    userId,
    userType,
  });
};

/**
 * Track when a step is viewed
 */
export const trackStepViewed = (
  tourPath: TourPath | string,
  step: TourStep,
  stepIndex: number,
  userId?: string,
  userType?: string
) => {
  const pathId = typeof tourPath === 'string' ? tourPath : tourPath.id;
  const pathName = typeof tourPath === 'string' ? pathId : (tourPath.name || tourPath.id);
  
  trackEvent('step_viewed', {
    pathId: pathId,
    tourId: pathId,
    tourName: pathName,
    stepId: step.id,
    stepIndex,
    totalSteps: typeof tourPath !== 'string' ? tourPath.steps.length : undefined,
    userId,
    userType,
  });
};

/**
 * Track when a step is skipped
 */
export const trackStepSkipped = (
  tourPath: TourPath | string,
  step: TourStep,
  stepIndex: number,
  userId?: string,
  userType?: string
) => {
  const pathId = typeof tourPath === 'string' ? tourPath : tourPath.id;
  const pathName = typeof tourPath === 'string' ? pathId : (tourPath.name || tourPath.id);
  
  trackEvent('step_skipped', {
    pathId: pathId,
    tourId: pathId,
    tourName: pathName,
    stepId: step.id,
    stepIndex,
    totalSteps: typeof tourPath !== 'string' ? tourPath.steps.length : undefined,
    userId,
    userType,
  });
};

/**
 * Track when a user interacts with a step
 */
export const trackStepInteraction = (
  tourPath: TourPath | string,
  step: TourStep,
  stepIndex: number,
  interactionType: TourInteractionType,
  userId?: string,
  userType?: string
) => {
  const pathId = typeof tourPath === 'string' ? tourPath : tourPath.id;
  const pathName = typeof tourPath === 'string' ? pathId : (tourPath.name || tourPath.id);
  
  trackEvent('step_interaction', {
    pathId: pathId,
    tourId: pathId,
    tourName: pathName,
    stepId: step.id,
    stepIndex,
    totalSteps: typeof tourPath !== 'string' ? tourPath.steps.length : undefined,
    userId,
    userType,
    interactionType,
    metadata: { interactionType },
  });
};
