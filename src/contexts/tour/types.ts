
// Tour context and component types
export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: "top" | "right" | "bottom" | "left";
  placement?: "top" | "right" | "bottom" | "left";
  animation?: string;
  elementId?: string;
  actions?: {
    next?: {
      text?: string;
      hidden?: boolean;
      callback?: () => void;
    };
    prev?: {
      text?: string;
      hidden?: boolean;
      callback?: () => void;
    };
    skip?: {
      text?: string;
      hidden?: boolean;
      callback?: () => void;
    };
    finish?: {
      text?: string;
      hidden?: boolean;
      callback?: () => void;
    };
  };
  transition?: string;
  a11y?: {
    title?: string;
    description?: string;
    nextLabel?: string;
    prevLabel?: string;
    closeLabel?: string;
    navigationDescription?: string;
  };
  dependency?: string | string[];
  dependencies?: string | string[];
  condition?: (state: any) => boolean;
  isOptional?: boolean;
  userRoles?: string[];
  isHidden?: boolean;
  order?: number;
  priority?: number;
  triggers?: string[];
  floatingUIOptions?: any;
  // Add missing properties used in the tour components
  path?: string | {
    enabled: boolean;
    targetElementId: string;
    style?: string;
    waypoints?: any[];
  };
  metadata?: Record<string, any>;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
}

export interface TourPath {
  id: string;
  name: string;
  steps: TourStep[];
  route?: string;
  description?: string;
  config?: Record<string, any>;
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
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
  setDynamicContent: (content: any) => void;
  setAvailablePaths: (paths: TourPath[]) => void;
  
  // Custom configuration
  customConfig: Record<string, any>;
  setCustomConfig: (config: Record<string, any>) => void;
  
  // Additional properties
  handleKeyNavigation: (e: KeyboardEvent) => void;
  visibleSteps: TourStep[];
  content: string;
  
  // Tour paths management
  setTourPaths: (paths: TourPath[]) => void;
  setVisibleSteps: (steps: TourStep[]) => void;
}
