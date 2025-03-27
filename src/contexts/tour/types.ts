
import { ReactNode } from "react";

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: "top" | "right" | "bottom" | "left";
  path?: string | {
    enabled: boolean;
    targetElementId: string;
    style: string;
    color?: string;
    animationDuration?: number;
    showArrow?: boolean;
    waypoints?: { x: number; y: number }[];
  };
  dependency?: TourDependency;
  metadata?: Record<string, any>;
  condition?: (state: any) => boolean;
  order?: number;
  isHidden?: boolean;
  elementId?: string;
  elementSelector?: string;
  spotlightPadding?: number;
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  disableOverlay?: boolean;
  hideButtons?: boolean;
  highlightTarget?: boolean;
  accessibilityOptions?: {
    a11yLabel?: string;
    ariaLive?: "off" | "polite" | "assertive";
    focusOnTitle?: boolean;
    roleDescription?: string;
  };
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  onBeforeStep?: (stepIndex: number) => Promise<boolean> | boolean;
  onAfterStep?: (stepIndex: number) => void;
  // Add missing properties
  animation?: string | {
    entry?: string;
    highlight?: string;
    exit?: string;
  };
  actions?: {
    next?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void;
    };
    prev?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void;
    };
    skip?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void;
    };
    finish?: {
      label?: string;
      callback?: () => void;
      onClick?: () => void;
    };
  };
  a11y?: {
    description?: string;
    navigationDescription?: string;
    focusStrategy?: 'first-interactive' | 'specific-element' | 'none';
    focusSelector?: string;
    removeAriaHidden?: boolean;
    announceOnEnter?: boolean;
    srOnly?: string;
  };
  placement?: string;
  isOptional?: boolean;
  dependencies?: string[];
  triggers?: {
    event: string;
    element?: string;
    condition?: () => boolean;
    action: () => void;
  }[];
  priority?: number;
  userRoles?: string[];
  spotlight?: {
    intensity?: "low" | "medium" | "high"; 
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  floatingUIOptions?: any;
}

export interface TourPath {
  id: string;
  name: string;
  description?: string;
  route?: string;
  steps: TourStep[];
  customConfig?: Record<string, any>;
  dependency?: TourDependency;
  useDefaultKeyboardNavigation?: boolean;
  showProgressIndicator?: boolean;
  metadata?: Record<string, any>;
  // Add missing properties
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  config?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    autoStart?: boolean;
    completionCallback?: () => void;
    metadata?: {
      route?: string;
      tags?: string[];
      userRoles?: string[];
      [key: string]: any;
    };
  };
}

export interface TourDependency {
  type: "step" | "path" | "feature" | "user" | "custom";
  completedSteps?: string[];
  completedPaths?: string[];
  enabledFeatures?: string[];
  userType?: string[];
  customCheck?: () => boolean | Promise<boolean>;
}

export interface TourContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: TourStep | null;
  currentPath: string | null;
  currentPathData?: TourPath;
  tourPaths: TourPath[];
  availablePaths: TourPath[];
  
  // Tour navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  startTour: (pathId: string) => void;
  endTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  resetTour: () => void;
  goToPath: (pathId: string) => void;
  
  // Tour state management
  registerPath: (path: TourPath) => void;
  unregisterPath: (pathId: string) => void;
  setDynamicContent: (stepId: string, content: string) => void;
  setAvailablePaths: (paths: TourPath[]) => void;
  
  // Custom configuration
  customConfig: Record<string, any>;
  setCustomConfig: (config: Record<string, any>) => void;
  
  // Additional properties
  handleKeyNavigation: (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent, navigationAction?: string) => void;
  visibleSteps: TourStep[];
  content: string;
  
  // Tour paths management
  setTourPaths: (paths: TourPath[] | ((prev: TourPath[]) => TourPath[])) => void;
  setVisibleSteps: (steps: TourStep[] | ((prev: TourStep[]) => TourStep[])) => void;
}
