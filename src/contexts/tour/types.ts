
import { TourThemeName } from '@/lib/tour/types/theme';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  // Add elementId as an alternative to target for backward compatibility
  elementId?: string;
  position?: 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  animation?: {
    entry?: string;
    highlight?: string;
    exit?: string;
  };
  spotlight?: {
    intensity?: 'low' | 'medium' | 'high';
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  transition?: {
    type: 'fade' | 'slide' | 'zoom' | 'flip' | 'none' | 'rotate' | 'blur' | 'reveal';
    direction?: 'up' | 'down' | 'left' | 'right';
    duration?: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    delay?: number;
  };
  optional?: boolean;
  isOptional?: boolean; // Legacy alias for optional
  actions?: {
    next?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void; // Legacy alias for callback
    };
    prev?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void; // Legacy alias for callback
    };
    skip?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void; // Legacy alias for callback
    };
  };
  media?: {
    type: 'image' | 'video' | 'gif';
    url: string;
    alt?: string;
    animation?: string;
  };
  condition?: () => boolean;
  onBefore?: () => Promise<void> | void;
  onAfter?: () => Promise<void> | void;
  
  // Additional properties needed by various components
  path?: {
    enabled?: boolean;
    targetElementId?: string;
    style?: string;
    color?: string;
    animationDuration?: number;
    showArrow?: boolean;
    waypoints?: Array<{x: number, y: number}>;
  };
  metadata?: Record<string, any>;
  priority?: number;
  triggers?: Array<{
    event: string;
    element?: string;
    condition?: () => boolean;
    action: () => void;
  }>;
  dependencies?: string[];
  userRoles?: string[];
  keyboardShortcuts?: Record<string, () => void>;
  effects3D?: {
    enabled: boolean;
    depth?: number;
    rotation?: { x: number; y: number; z: number };
  };
}

export interface TourPath {
  id: string;
  name?: string; // Make name optional for backward compatibility
  steps: TourStep[];
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  config?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    autoStart?: boolean;
    completionCallback?: () => void;
    metadata?: Record<string, any>;
    userRoles?: string[];
    accessibility?: {
      announceSteps?: boolean;
      keyboardNavigation?: boolean;
      restoreFocus?: boolean;
      focusTrap?: boolean;
    };
  };
}

export interface TourContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: TourStep | null;
  currentPath: TourPath | null;
  availablePaths: TourPath[];
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  startTour: (pathId?: string, stepIndex?: number) => void;
  endTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  resetTour: () => void;
  goToPath: (pathId: string, stepIndex?: number) => void;
  registerPath: (path: TourPath) => void;
  unregisterPath: (pathId: string) => void;
  setDynamicContent: (content: string) => void;
  setAvailablePaths: (paths: TourPath[]) => void;
  customConfig: {
    theme: TourThemeName;
    transitions?: {
      duration: number;
      easing: string;
    };
    customColors?: Record<string, string>;
  };
  setCustomConfig: React.Dispatch<React.SetStateAction<{
    theme: TourThemeName;
    transitions?: {
      duration: number;
      easing: string;
    };
    customColors?: Record<string, string>;
  }>>;
  handleKeyNavigation: (event: React.KeyboardEvent | KeyboardEvent) => void;
  visibleSteps: TourStep[];
  content?: string;
}

export { defaultContext } from './defaults';
