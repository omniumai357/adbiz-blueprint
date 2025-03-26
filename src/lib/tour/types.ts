
import { TourThemeName } from './types/theme';

// Re-export the types from contexts for consistency
export type { TourStep, TourPath, TourContextType } from '@/contexts/tour/types';

// Common tour properties
export interface TourConfig {
  allowSkip?: boolean;
  showProgress?: boolean;
  theme?: TourThemeName;
  showStepIndicators?: boolean;
  enableKeyboardNavigation?: boolean;
  enableScreenReaderAnnouncements?: boolean;
  autoScrollToTarget?: boolean;
  scrollOptions?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
    offset?: number;
  };
}

// Tour analytics event data
export interface TourAnalyticsEventData {
  tourId: string;
  stepId: string;
  stepIndex: number;
  totalSteps: number;
  timestamp: number;
  userId?: string;
  userRole?: string;
  interactionType?: string;
  metadata?: Record<string, any>;
}

// Tour element querying strategies
export interface ElementQueryStrategy {
  type: 'id' | 'class' | 'selector' | 'xpath' | 'element';
  value: string;
  fallback?: string;
  retryTimeout?: number;
  maxRetries?: number;
}

// Tour path dependency rules
export interface TourDependencyRule {
  stepId: string;
  type: 'visited' | 'completed' | 'skipped' | 'custom';
  value?: any;
  operator?: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  customCheck?: (stepData: any) => boolean;
}

// Function that returns dynamic content for a tour step
export type DynamicContentProvider = () => string | Promise<string>;

// Tour path theme
export interface TourTheme {
  name: TourThemeName;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  overlayColor: string;
  overlayOpacity: number;
  borderRadius: string;
  boxShadow: string;
  fontFamily: string;
  css?: string;
}
