
import { TourContextType } from './types';

export const defaultContext: TourContextType = {
  isActive: false,
  currentPath: null,
  currentStep: 0,
  totalSteps: 0,
  startTour: () => {},
  endTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  currentStepData: null,
  availablePaths: [],
  handleKeyNavigation: () => {},
  visibleSteps: [],
  setDynamicContent: () => {},
};
