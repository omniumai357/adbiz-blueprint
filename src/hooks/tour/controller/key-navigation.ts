
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { useIsMobile } from '@/hooks/use-mobile';

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
    isMobileDevice?: boolean;
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
    handlers,
    isMobileDevice = false
  } = options;
  
  if (!isActive) return;
  
  const pathData = tourPaths.find(path => path.id === currentPath);
  if (!pathData) return;
  
  const currentStepData = visibleSteps[currentStep];
  if (!currentStepData) return;
  
  const { nextStep, prevStep, endTour, trackInteraction } = handlers;
  
  // On mobile, we might want to handle keyboard events differently
  // For example, virtual keyboards on mobile can behave differently
  if (isMobileDevice) {
    // For mobile, only handle Escape key for now
    // Let touch gestures handle the rest
    if (event.key === 'Escape') {
      trackInteraction(
        pathData,
        currentStepData,
        currentStep,
        `key_navigation_${event.key}`,
        userId,
        userType
      );
      endTour();
    }
    return;
  }
  
  // Only apply keyboard shortcuts if specified in the step or using defaults
  const keyboardShortcuts = currentStepData.keyboardShortcuts || {
    next: 'ArrowRight',
    previous: 'ArrowLeft',
    close: 'Escape'
  };
  
  // Standard desktop keyboard navigation
  switch(event.key) {
    case keyboardShortcuts.next:
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
    case keyboardShortcuts.previous:
      if (currentStep > 0) {
        trackInteraction(
          pathData,
          currentStepData,
          currentStep,
          `key_navigation_${event.key}`,
          userId,
          userType
        );
        prevStep();
      }
      break;
    case keyboardShortcuts.close:
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

/**
 * Hook to detect if the current browser is on a mobile device
 * for use with key navigation
 */
export const useMobileKeyboardDetection = () => {
  const isMobile = useIsMobile();
  return isMobile;
};
