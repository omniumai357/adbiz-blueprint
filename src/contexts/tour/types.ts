
export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  elementId?: string;
  position?: "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  placement?: string;
  a11y?: {
    description?: string;
    navigationDescription?: string;
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
  condition?: () => boolean | Promise<boolean>;
  onBeforeStep?: () => Promise<boolean> | boolean;
  onAfterStep?: () => void;
  delay?: number;
  animation?: string | {
    entry?: string;
    highlight?: string;
    exit?: string;
  };
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  disableOverlay?: boolean;
  disableScrolling?: boolean;
  disableCloseOnEsc?: boolean;
  disableCloseOnClickOutside?: boolean;
  disableKeyboardNavigation?: boolean;
  spotlightPadding?: number;
  isOptional?: boolean;
  showProgress?: boolean;
  floatingUIOptions?: any;
  highlightClass?: string;
  effects3D?: {
    enable?: boolean;
    intensity?: number;
  };
  metadata?: Record<string, any>;
  dependencies?: string[];
  triggers?: {
    event: string;
    element?: string;
    condition?: () => boolean;
    action: () => void;
  }[];
  priority?: number;
  userRoles?: string[];
  path?: string | {
    enabled: boolean;
    targetElementId: string;
    style: string;
    color?: string;
    animationDuration?: number;
    showArrow?: boolean;
    waypoints?: Array<{x: number, y: number}>;
  };
  spotlight?: {
    intensity?: "low" | "medium" | "high"; 
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
  keyboardShortcuts?: Record<string, string>;
  waypoints?: Array<{x: number, y: number}>;
  enabled?: boolean;
  targetElementId?: string;
  style?: string;
  color?: string;
  animationDuration?: number;
  showArrow?: boolean;
}

export interface TourPath {
  id: string;
  name?: string;
  steps: TourStep[];
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  route?: string; // Add the route property to fix errors
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
  currentPath: TourPath | null | string;
  availablePaths: TourPath[];
  
  // Tour navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
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
  customConfig: {
    theme?: string;
    isMobile?: boolean;
    [key: string]: any;
  };
  setCustomConfig: (config: any) => void;
  
  // Additional properties
  handleKeyNavigation: (event: KeyboardEvent) => void;
  visibleSteps: TourStep[];
  content: string;
}
