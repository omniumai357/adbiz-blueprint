
import { TourThemeConfig } from "@/lib/tour/types/theme";

export interface TourStep {
  id: string;
  elementId: string;
  title: string;
  content: string;
  position: string | "top" | "right" | "bottom" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  animation?: {
    entry?: string;
    highlight?: string;
    exit?: string;
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
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  actions?: {
    next?: {
      label?: string;
      callback?: () => void;
    };
    prev?: {
      label?: string;
      callback?: () => void;
    };
    skip?: {
      label?: string;
      callback?: () => void;
    };
  };
  condition?: () => boolean;
  onBeforeShow?: () => Promise<void> | void;
  onAfterShow?: () => Promise<void> | void;
  onBeforeHide?: () => Promise<void> | void;
  onAfterHide?: () => Promise<void> | void;
  dynamicContent?: boolean;
  dependencies?: string[];
  optional?: boolean;
  targeting?: {
    observe?: boolean;
    retryTimeout?: number;
    maxRetries?: number;
  };
  metadata?: Record<string, any>;
}

export interface TourPath {
  id: string;
  name: string;
  steps: TourStep[];
  config?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    showKeyboardShortcuts?: boolean;
    completionCallback?: () => void;
    useDynamicTargeting?: boolean;
    saveProgress?: boolean;
    autoStart?: boolean;
    metadata?: Record<string, any>;
  };
}

export interface TourContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: TourStep | null;
  currentPath: TourPath | null;
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
  goToPath: (pathId: string, stepIndex?: number) => void;
  
  // Tour state management
  registerPath: (path: TourPath) => void;
  unregisterPath: (pathId: string) => void;
  setDynamicContent: (content: string) => void;
  setAvailablePaths: (paths: TourPath[]) => void;
  
  // Custom configuration
  customConfig?: {
    theme?: string;
    customColors?: Record<string, string>;
    language?: string;
    translations?: Record<string, Record<string, string>>;
    [key: string]: any;
  };
  setCustomConfig: React.Dispatch<React.SetStateAction<any>>;
}

export const defaultContext: TourContextType = {
  isActive: false,
  currentStep: 0,
  totalSteps: 0,
  currentStepData: null,
  currentPath: null,
  availablePaths: [],
  
  // Tour navigation
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  startTour: () => {},
  endTour: () => {},
  pauseTour: () => {},
  resumeTour: () => {},
  resetTour: () => {},
  goToPath: () => {},
  
  // Tour state management
  registerPath: () => {},
  unregisterPath: () => {},
  setDynamicContent: () => {},
  setAvailablePaths: () => {},
  
  // Custom configuration
  customConfig: {
    theme: "default"
  },
  setCustomConfig: () => {}
};
