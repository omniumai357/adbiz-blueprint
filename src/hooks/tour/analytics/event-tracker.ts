
import { TourAnalyticsData, TourAnalyticsEvent, TourInteractionType } from './types';
import { storeTourEvent } from './storage-service';

/**
 * Track a tour analytics event
 * 
 * @param event Event type to track
 * @param data Additional data to store with the event
 */
export function trackTourEvent(
  event: TourAnalyticsEvent,
  data: Omit<TourAnalyticsData, 'timestamp' | 'eventType'>
) {
  try {
    const analyticsData: TourAnalyticsData = {
      ...data,
      eventType: event,
      timestamp: new Date().toISOString()
    };
    
    storeTourEvent(analyticsData);
    return true;
  } catch (error) {
    console.error('Error tracking tour event:', error);
    return false;
  }
}

/**
 * Track when a tour is started
 */
export function trackTourStarted(data: {
  pathId: string;
  tourId: string;
  tourName: string;
}) {
  return trackTourEvent('tour:started', data);
}

/**
 * Track when a tour is completed
 */
export function trackTourCompleted(data: {
  pathId: string;
  tourId: string;
  tourName: string;
  totalSteps: number;
  userId: string;
  userType: string;
  metadata: Record<string, any>;
}) {
  return trackTourEvent('tour:completed', data);
}

/**
 * Track when a tour is exited early (alias for backward compatibility)
 */
export function trackTourAbandoned(data: {
  pathId: string;
  tourId: string;
  tourName: string;
  stepIndex: number;
  totalSteps: number;
  userId: string;
  userType: string;
}) {
  return trackTourExited(data);
}

/**
 * Track when a tour is exited early
 */
export function trackTourExited(data: {
  pathId: string;
  tourId: string;
  tourName: string;
  stepIndex: number;
  totalSteps: number;
  userId: string;
  userType: string;
}) {
  return trackTourEvent('tour:exited', data);
}

/**
 * Track when a step is viewed
 */
export function trackStepViewed(data: {
  pathId: string;
  tourId: string;
  tourName: string;
  stepId: string;
  stepIndex: number;
  totalSteps: number;
  userId: string;
  userType: string;
}) {
  return trackTourEvent('step:viewed', data);
}

/**
 * Track when a step is skipped (alias for trackInteraction with skip type)
 */
export function trackStepSkipped(data: {
  pathId: string;
  tourId: string;
  tourName: string;
  stepId: string;
  stepIndex: number;
  totalSteps: number;
  userId: string;
  userType: string;
}) {
  return trackInteraction('skip', data);
}

/**
 * Track when an interaction occurs during a tour
 */
export function trackInteraction(
  interactionType: TourInteractionType,
  data: {
    pathId: string;
    tourId: string;
    tourName: string;
    stepId: string;
    stepIndex: number;
    totalSteps: number;
    userId: string;
    userType: string;
  }
) {
  return trackTourEvent('interaction', {
    ...data,
    interactionType,
  });
}

/**
 * Alias for trackInteraction to maintain compatibility with legacy code
 */
export function trackStepInteraction(
  pathData: any,
  stepData: any,
  stepIndex: number,
  interactionType: string,
  userId?: string,
  userType?: string
) {
  return trackInteraction(interactionType, {
    pathId: typeof pathData === 'string' ? pathData : pathData.id,
    tourId: typeof pathData === 'string' ? pathData : pathData.id,
    tourName: typeof pathData === 'string' ? pathData : (pathData.name || ''),
    stepId: typeof stepData === 'string' ? stepData : stepData.id,
    stepIndex,
    totalSteps: 0, // This will need to be provided by the caller
    userId: userId || '',
    userType: userType || '',
  });
}

/**
 * Track when a theme changes
 */
export function trackThemeChanged(data: {
  previousTheme: string;
  newTheme: string;
  userId: string;
  userType: string;
  metadata?: Record<string, any>;
}) {
  return trackTourEvent('theme:changed', data);
}
