
import React, { createContext, useContext } from "react";
import { TourContextType, TourStep, TourPath } from './types';

// Default implementation of the tour context
const defaultContext: TourContextType = {
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
  customConfig: {},
  setCustomConfig: () => {},
  
  // Additional properties
  handleKeyNavigation: () => {},
  visibleSteps: [],
  content: ''
};

const TourContext = createContext<TourContextType>(defaultContext);

export const useTour = () => useContext(TourContext);

export { TourContext, defaultContext };
