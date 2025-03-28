
// Tour step interface
export interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  animation?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  placement?: 'top' | 'right' | 'bottom' | 'left';
  actions?: {
    next?: TourStepAction;
    prev?: TourStepAction;
    skip?: TourStepAction;
    finish?: TourStepAction;
    close?: TourStepAction;
  };
  media?: {
    type: 'image' | 'video';
    source: string;
    alt?: string;
    animation?: string;
  };
  // Additional properties that are being referenced in the codebase
  elementId?: string;
  path?: {
    enabled: boolean;
    targetElementId: string;
    style?: string;
    waypoints?: Array<{ x: number; y: number }>;
  };
  pathVisualization?: {
    type: string;
    style: string;
    color?: string;
    enabled: boolean;
    targetElementId: string;
  };
  isHidden?: boolean;
  condition?: (data?: any) => boolean;
  order?: number;
  metadata?: Record<string, any>;
  dependencies?: string[];
  userRoles?: string[];
  isOptional?: boolean;
  triggers?: string[];
  priority?: number;
  selector?: string;
  floatingUIOptions?: any;
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  // Add any other properties you encounter in the errors
}

// Action for tour steps
export interface TourStepAction {
  text?: string;
  callback?: () => void;
  hidden?: boolean;
  // Add any other properties you encounter
}

// Tour path interface
export interface TourPath {
  id: string;
  name: string;
  description?: string;
  steps: TourStep[];
  route?: string;
  // Additional properties referenced in the codebase
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  metadata?: Record<string, any>;
  config?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    metadata?: {
      route?: string;
      tags?: string[];
      userRoles?: string[];
      experienceLevel?: string;
    }
  };
  // Add any other properties you encounter
}

// Export a complete TourContextType for other files to use
export interface TourContextType {
  isActive: boolean;
  currentStep: number;
  currentPath: string | null;
  currentPathData?: TourPath;
  currentStepData: TourStep | null;
  totalSteps: number;
  visibleSteps: TourStep[];
  tourPaths: TourPath[];
  availablePaths: TourPath[];
  
  // Tour navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  startTour: (pathId: string) => void;
  endTour: () => void;
  pauseTour?: () => void;
  resumeTour?: () => void;
  resetTour?: () => void;
  goToPath?: () => void;
  
  // Tour state management
  registerPath?: () => void;
  unregisterPath?: () => void;
  setDynamicContent?: () => void;
  setAvailablePaths?: (paths: TourPath[]) => void;
  
  // Custom configuration
  customConfig?: any;
  setCustomConfig?: (config: any) => void;
  
  // Additional properties
  handleKeyNavigation?: () => void;
  content?: string;
  
  // Tour paths management
  setTourPaths: React.Dispatch<React.SetStateAction<TourPath[]>>;
  setVisibleSteps: React.Dispatch<React.SetStateAction<TourStep[]>>;
}
