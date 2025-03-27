
import { TourContextType } from './types';

export const defaultContext: TourContextType = {
  isActive: false,
  currentStep: 0,
  totalSteps: 0,
  currentStepData: null,
  currentPath: null,
  currentPathData: undefined,
  tourPaths: [],
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
  setCustomConfig: () => {},
  
  // Additional properties
  handleKeyNavigation: () => {},
  visibleSteps: [],
  content: "",
  
  // Tour paths management
  setTourPaths: () => {},
  setVisibleSteps: () => {}
};
