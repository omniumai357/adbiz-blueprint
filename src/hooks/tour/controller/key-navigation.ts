
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';

export type NavigationHandler = {
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  trackInteraction: (
    pathData: TourPath,
    currentStepData: TourStep,
    currentStep: number,
    interactionType: string,
    userId?: string,
    userType?: string
  ) => void;
};

/**
 * Handles keyboard navigation for tours
 * @param event The keyboard event
 * @param options Options including handler functions and tour state
 */
export const handleKeyNavigation = (
  event: KeyboardEvent | ReactKeyboardEvent,
  options: {
    isActive: boolean;
    currentPath: string | null;
    tourPaths: TourPath[];
    currentStep: number;
    visibleSteps: TourStep[];
    userId?: string;
    userType?: string;
    handlers: NavigationHandler;
  }
): void => {
  const { 
    isActive, 
    currentPath, 
    tourPaths, 
    currentStep, 
    visibleSteps,
    userId,
    userType,
    handlers 
  } = options;
  
  if (!isActive) return;
  
  const pathData = tourPaths.find(path => path.id === currentPath);
  if (!pathData) return;
  
  const currentStepData = visibleSteps[currentStep];
  if (!currentStepData) return;
  
  const { nextStep, prevStep, endTour, trackInteraction } = handlers;
  
  switch(event.key) {
    case 'ArrowRight':
    case 'Enter':
      trackInteraction(
        pathData,
        currentStepData,
        currentStep,
        `key_navigation_${event.key}`,
        userId,
        userType
      );
      nextStep();
      break;
    case 'ArrowLeft':
      trackInteraction(
        pathData,
        currentStepData,
        currentStep,
        `key_navigation_${event.key}`,
        userId,
        userType
      );
      prevStep();
      break;
    case 'Escape':
      trackInteraction(
        pathData,
        currentStepData,
        currentStep,
        `key_navigation_${event.key}`,
        userId,
        userType
      );
      endTour();
      break;
    default:
      break;
  }
};
