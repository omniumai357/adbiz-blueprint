
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
  // Add any other properties you encounter in the errors
}

// Action for tour steps
export interface TourStepAction {
  text?: string;
  callback?: () => void;
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
  startTour: (pathId: string) => void;
  endTour: () => void;
  goToStep: (stepIndex: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  registerTour: (path: TourPath) => void;
  unregisterTour: (pathId: string) => void;
  setTourPaths: React.Dispatch<React.SetStateAction<TourPath[]>>;
  setVisibleSteps: React.Dispatch<React.SetStateAction<TourStep[]>>;
}
