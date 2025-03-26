
export type StepConditionFn = () => boolean | Promise<boolean>;

export type StepAnimation = {
  entry?: string;
  exit?: string;
  highlight?: string;
  transition?: string;
  duration?: number;
};

export type StepTrigger = {
  event?: string;
  elementId?: string;
  action?: string;
  delay?: number;
};

export type StepUserRole = "anonymous" | "user" | "admin" | string;

export type TourStep = {
  id: string;
  elementId: string;
  title: string;
  content: string;
  position?: "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  condition?: StepConditionFn;
  animation?: StepAnimation;
  isOptional?: boolean;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  actions?: {
    next?: {
      label?: string;
      onClick?: () => void;
    };
    prev?: {
      label?: string;
      onClick?: () => void;
    };
    skip?: {
      label?: string;
      onClick?: () => void;
    };
  };
  userRoles?: StepUserRole[];
  triggers?: StepTrigger[];
  priority?: number;
  metadata?: Record<string, any>;
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
    focus?: "element" | "content" | "both";
    blurBackground?: boolean;
    zoomEffect?: boolean;
  };
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none" | "rotate" | "blur" | "reveal";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
    easing?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
    delay?: number;
  };
  path?: {
    enabled?: boolean;
    targetElementId?: string;
    waypoints?: string[];
    style?: "direct" | "curved" | "angled" | "obstacle-avoiding";
    color?: string;
    width?: number;
    dashArray?: string;
    animationDuration?: number;
    showArrow?: boolean;
    arrowSize?: number;
    avoidObstacles?: boolean;
    tensionFactor?: number;
    animationEasing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  } & Partial<any>; // PathOptions will be imported from path-utils
  effects3D?: {
    perspective?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    scale?: number;
    duration?: number;
  };
  ariaLive?: "off" | "polite" | "assertive";
  focusOnOpen?: boolean;
  keyboardShortcuts?: {
    next?: string;
    previous?: string;
    close?: string;
  };
};

export type TourPath = {
  id: string;
  name: string;
  steps: TourStep[];
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  requiredUserRoles?: StepUserRole[];
  completionCallback?: () => void;
  metadata?: Record<string, any>;
  accessibility?: {
    announceSteps?: boolean;
    keyboardNavigation?: boolean;
    restoreFocus?: boolean;
    focusTrap?: boolean;
  };
};

export type TourContextType = {
  isActive: boolean;
  currentPath: string | null;
  currentStep: number;
  totalSteps: number;
  startTour: (pathId: string) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  currentStepData: TourStep | null;
  availablePaths: TourPath[];
  handleKeyNavigation: (event: React.KeyboardEvent) => void;
  visibleSteps: TourStep[];
  setDynamicContent: (stepId: string, content: string) => void;
};
