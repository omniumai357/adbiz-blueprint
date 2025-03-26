import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { useIsMobile } from '@/hooks/use-mobile';

export type NavigationHandler = {
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  goToStep: (stepIndex: number) => void;
  trackInteraction: (
    pathData: TourPath,
    currentStepData: TourStep,
    currentStep: number,
    interactionType: string,
    userId?: string,
    userType?: string
  ) => void;
  showKeyboardShortcutsHelp?: () => void;
};

/**
 * Handles keyboard navigation for tours
 * @param event The keyboard event
 * @param navigationAction Optional pre-determined navigation action
 * @param options Options including handler functions and tour state
 */
export const handleKeyNavigation = (
  event: KeyboardEvent | ReactKeyboardEvent,
  navigationAction: string | undefined,
  options: {
    isActive: boolean;
    currentPath: string | null;
    tourPaths: TourPath[];
    currentStep: number;
    totalSteps: number;
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
    totalSteps,
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
  
  const { nextStep, prevStep, endTour, goToStep, trackInteraction, showKeyboardShortcutsHelp } = handlers;
  
  if (isMobileDevice) {
    if (event.key === 'Escape' || navigationAction === 'escape') {
      trackInteraction(
        pathData,
        currentStepData,
        currentStep,
        `key_navigation_escape`,
        userId,
        userType
      );
      endTour();
      return;
    }
    
    if (navigationAction) {
      handleNavigationAction(
        navigationAction,
        currentStep,
        totalSteps,
        goToStep,
        nextStep,
        prevStep,
        showKeyboardShortcutsHelp
      );
      return;
    }
  }
  
  const keyboardShortcuts = currentStepData.keyboardShortcuts || {
    next: 'ArrowRight',
    previous: 'ArrowLeft',
    close: 'Escape'
  };
  
  if (navigationAction) {
    trackInteraction(
      pathData,
      currentStepData,
      currentStep,
      `key_navigation_${navigationAction}`,
      userId,
      userType
    );
    
    handleNavigationAction(
      navigationAction,
      currentStep,
      totalSteps,
      goToStep,
      nextStep,
      prevStep,
      showKeyboardShortcutsHelp
    );
    return;
  }
  
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

function handleNavigationAction(
  action: string,
  currentStep: number,
  totalSteps: number,
  goToStep: (stepIndex: number) => void,
  nextStep: () => void,
  prevStep: () => void,
  showKeyboardShortcutsHelp?: () => void
): void {
  if (action === 'first_step') {
    goToStep(0);
  } else if (action === 'last_step') {
    goToStep(totalSteps - 1);
  } else if (action.startsWith('jump_forward_')) {
    const steps = parseInt(action.split('_')[2], 10);
    const targetStep = Math.min(currentStep + steps, totalSteps - 1);
    goToStep(targetStep);
  } else if (action.startsWith('jump_back_')) {
    const steps = parseInt(action.split('_')[2], 10);
    const targetStep = Math.max(currentStep - steps, 0);
    goToStep(targetStep);
  } else if (action === 'show_shortcuts_help' && showKeyboardShortcutsHelp) {
    showKeyboardShortcutsHelp();
  } else if (action === 'next_from_element') {
    nextStep();
  }
}

export const useMobileKeyboardDetection = () => {
  const isMobile = useIsMobile();
  return isMobile;
};
