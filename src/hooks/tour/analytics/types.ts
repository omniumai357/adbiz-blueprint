
/**
 * Tour analytics event types
 */
export type TourAnalyticsEvent = 
  | 'tour:started'
  | 'tour:completed'
  | 'tour:exited'
  | 'step:viewed'
  | 'interaction'
  | 'theme:changed';

/**
 * Types of user interactions with the tour
 */
export type TourInteractionType = 
  | 'next'
  | 'prev'
  | 'close'
  | 'skip'
  | 'restart'
  | 'keyboard'
  | 'click'
  | 'swipe'
  | 'theme'
  | 'custom';

/**
 * Tour analytics data structure
 */
export interface TourAnalyticsData {
  /** Event type */
  eventType: TourAnalyticsEvent;
  /** ISO timestamp when the event occurred */
  timestamp: string;
  /** Tour path identifier */
  pathId?: string;
  /** Tour identifier */
  tourId?: string;
  /** Tour display name */
  tourName?: string;
  /** Tour step identifier */
  stepId?: string;
  /** Current step index */
  stepIndex?: number;
  /** Total steps in tour */
  totalSteps?: number;
  /** User identifier */
  userId?: string;
  /** User type or role */
  userType?: string;
  /** Type of interaction if event is 'interaction' */
  interactionType?: TourInteractionType;
  /** Previous theme (for theme:changed events) */
  previousTheme?: string;
  /** New theme (for theme:changed events) */
  newTheme?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Storage options for tour analytics
 */
export interface TourAnalyticsStorageOptions {
  /** Max events to store */
  maxEvents?: number;
  /** Storage key */
  storageKey?: string;
  /** Use session storage instead of local storage */
  useSessionStorage?: boolean;
}

/**
 * Tour analytics export options
 */
export interface TourAnalyticsExportOptions {
  /** Format to export (json, csv) */
  format?: 'json' | 'csv';
  /** Download filename */
  filename?: string;
  /** Whether to clear analytics after export */
  clearAfterExport?: boolean;
}
