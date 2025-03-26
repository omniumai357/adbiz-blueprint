
import { TourThemeName } from '@/lib/tour/types/theme';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
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
    type: 'fade' | 'slide' | 'zoom' | 'flip' | 'none';
    direction?: 'up' | 'down' | 'left' | 'right';
    duration?: number;
  };
  optional?: boolean;
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
  media?: {
    type: 'image' | 'video' | 'gif';
    url: string;
    alt?: string;
    animation?: string;
  };
  condition?: () => boolean;
  onBefore?: () => Promise<void> | void;
  onAfter?: () => Promise<void> | void;
}

export interface TourPath {
  id: string;
  steps: TourStep[];
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
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
}

export { defaultContext } from './defaults';
