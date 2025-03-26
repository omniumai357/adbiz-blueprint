
import { TourPath, TourStep } from "@/contexts/tour/types";

/**
 * Tour analytics data structure
 */
export interface TourAnalyticsData {
  userId?: string;
  userType?: string;
  tourId: string;
  tourName: string;
  eventType: TourAnalyticsEventType;
  stepId?: string;
  stepIndex?: number;
  totalSteps?: number;
  interactionType?: TourInteractionType;
  timestamp: number;
  metadata?: Record<string, any>;
  // Added properties for backward compatibility
  event?: TourAnalyticsEventType;
  pathId?: string;
}

export type TourAnalyticsEventType = 
  | 'tour_start'
  | 'tour_end'
  | 'tour_skip'
  | 'step_view'
  | 'step_interaction'
  | 'step_timeout'
  | 'tour_started'
  | 'tour_completed'
  | 'tour_abandoned'
  | 'step_viewed'
  | 'step_skipped'
  | 'step_interaction';

export type TourInteractionType = 
  | 'next'
  | 'previous'
  | 'skip'
  | 'close'
  | 'click_element'
  | 'key_navigation'
  | 'jump_to_step'
  | 'jump_to_first'
  | 'jump_to_last'
  | 'jump_forward'
  | 'jump_backward'
  | 'zoom'
  | 'pan'
  | 'show_shortcut_help'
  | 'completed'
  | 'go_back'
  | 'jump_to_step_0' // Supporting dynamic step jump interactions
  | 'jump_to_step_1'
  | 'jump_to_step_2'
  | 'jump_to_step_3'
  | 'jump_to_step_4'
  | 'jump_to_step_5'
  | string; // Allow string for dynamic step interactions

export type TourAnalyticsEvent = {
  type: TourAnalyticsEventType;
  data: TourAnalyticsData;
};

export type TourAnalyticsHandler = (event: TourAnalyticsEvent) => void;

export type DynamicContentProvider = () => string | Promise<string>;

export type ConditionEvaluator = () => boolean | Promise<boolean>;

export interface TourAnalyticsService {
  trackTourStart: (
    tour: TourPath | string,
    userId?: string,
    userType?: string,
    metadata?: Record<string, any>
  ) => void;
  
  trackTourEnd: (
    tour: TourPath | string,
    completed: boolean,
    userId?: string,
    userType?: string,
    metadata?: Record<string, any>
  ) => void;
  
  trackStepView: (
    tour: TourPath | string,
    step: TourStep | null,
    stepIndex: number,
    userId?: string,
    userType?: string,
    metadata?: Record<string, any>
  ) => void;
  
  trackStepInteraction: (
    tour: TourPath | string,
    step: TourStep | null,
    stepIndex: number,
    interactionType: TourInteractionType,
    userId?: string,
    userType?: string,
    metadata?: Record<string, any>
  ) => void;
}
