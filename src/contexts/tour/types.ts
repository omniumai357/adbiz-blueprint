
// If this file exists, we'll extend it. 
// If it doesn't exist, we'll create a basic version here

export interface TourPathVisualization {
  enabled: boolean;
  targetElementId: string;
  style?: string;
  waypoints?: any[];
  color?: string;
  animationDuration?: number;
  showArrow?: boolean;
}

export interface TourStepAction {
  text?: string;
  hidden?: boolean;
  callback?: () => void;
}

export interface TourStepActions {
  next?: TourStepAction;
  prev?: TourStepAction;
  skip?: TourStepAction;
  finish?: TourStepAction;
  close?: TourStepAction;
}

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  elementId?: string;
  selector?: string;
  placement?: "top" | "right" | "bottom" | "left";
  actions?: TourStepActions;
  condition?: (state: any) => boolean;
  priority?: number;
  triggers?: string[];
  triggerData?: any[];
  pathVisualization?: TourPathVisualization;
  metadata?: {
    responsiveContent?: {
      default: string;
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
    responsivePosition?: {
      default: string;
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
    responsiveSelector?: {
      default: string;
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
    [key: string]: any;
  };
  
  // Additional properties needed by various components
  animation?: string;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  path?: string | {
    enabled: boolean;
    targetElementId: string;
    style: string;
    color?: string;
    animationDuration?: number;
    showArrow?: boolean;
    waypoints?: Array<{x: number, y: number}>;
  };
  dependencies?: string[];
  isHidden?: boolean;
  order?: number;
  position?: string;
  isOptional?: boolean;
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  floatingUIOptions?: any;
  userRoles?: string[];
  highlightClass?: string;
  effects3D?: {
    enable?: boolean;
    intensity?: number;
  };
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
}

export interface TourPath {
  id: string;
  name: string;
  description?: string;
  steps: TourStep[];
  
  // Additional properties needed by components
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  route?: string;
  config?: {
    metadata?: Record<string, any>;
    allowSkip?: boolean;
    showProgress?: boolean;
    autoStart?: boolean;
  };
}

export interface TourStepData {
  stepId: string;
  pathId: string;
  tourId: string;
  tourName: string;
  stepIndex: number;
  totalSteps: number;
  userId: string;
  userType: string;
}

export interface TourStartData extends Omit<TourStepData, 'stepId'> {}

export interface TourCompleteData extends Omit<TourStepData, 'stepId'> {}

export type TourStepEnhancer = (step: TourStep) => TourStep;

// Tour context type definition
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
  goToStep: (index: number) => void;
  startTour: (pathId?: string) => void;
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
  handleKeyNavigation: (event: React.KeyboardEvent<Element> | KeyboardEvent) => void;
  visibleSteps: TourStep[];
  content: string;
  
  // Tour paths management
  setTourPaths: (paths: TourPath[]) => void;
  setVisibleSteps: (steps: TourStep[]) => void;
}
