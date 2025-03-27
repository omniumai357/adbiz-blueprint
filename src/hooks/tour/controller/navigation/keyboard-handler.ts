
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { TourPath, TourStep } from '@/contexts/tour-context';
import { KeyboardHandlerOptions } from './types';
import { handleNavigationAction, parseNavigationAction } from './navigation-actions';

/**
 * Handles keyboard navigation for tours
 * @param event The keyboard event
 * @param navigationAction Optional pre-determined navigation action
 * @param options Options including handler functions and tour state
 */
export const handleKeyNavigation = (
  event: KeyboardEvent | ReactKeyboardEvent,
  navigationAction: string | undefined,
  options: KeyboardHandlerOptions
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
  
  // Handle mobile-specific navigation
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
  
  // Get default keyboard shortcuts if defined in the step data
  const keyboardShortcuts = currentStepData.keyboardShortcuts || {
    next: 'ArrowRight',
    previous: 'ArrowLeft',
    close: 'Escape'
  };
  
  // Handle predefined navigation actions
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
  
  // Handle regular keyboard shortcuts
  switch(event.key) {
    case keyboardShortcuts.next:
    case 'Enter':
    case 'n':
    case 'N':
      if (event.altKey && event.shiftKey && (event.key === 'n' || event.key === 'N')) {
        // Alt+Shift+N for accessibility shortcut
        trackInteraction(
          pathData,
          currentStepData,
          currentStep,
          `key_navigation_alt_shift_n`,
          userId,
          userType
        );
        nextStep();
      } else if (!event.altKey && !event.ctrlKey && (event.key === keyboardShortcuts.next || event.key === 'Enter')) {
        trackInteraction(
          pathData,
          currentStepData,
          currentStep,
          `key_navigation_${event.key}`,
          userId,
          userType
        );
        nextStep();
      }
      break;
    case keyboardShortcuts.previous:
    case 'p':
    case 'P':
      if (currentStep > 0) {
        if (event.altKey && event.shiftKey && (event.key === 'p' || event.key === 'P')) {
          // Alt+Shift+P for accessibility shortcut
          trackInteraction(
            pathData,
            currentStepData,
            currentStep,
            `key_navigation_alt_shift_p`,
            userId,
            userType
          );
          prevStep();
        } else if (!event.altKey && !event.ctrlKey && event.key === keyboardShortcuts.previous) {
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
      }
      break;
    case keyboardShortcuts.close:
    case 's':
    case 'S':
      if (event.altKey && event.shiftKey && (event.key === 's' || event.key === 'S')) {
        // Alt+Shift+S for skip/close tour
        trackInteraction(
          pathData,
          currentStepData,
          currentStep,
          `key_navigation_alt_shift_s`,
          userId,
          userType
        );
        endTour();
      } else if (event.key === keyboardShortcuts.close) {
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
      break;
    case 'h':
    case 'H':
      if (event.altKey && event.shiftKey && showKeyboardShortcutsHelp) {
        // Alt+Shift+H for help
        trackInteraction(
          pathData,
          currentStepData,
          currentStep,
          `key_navigation_alt_shift_h`,
          userId,
          userType
        );
        showKeyboardShortcutsHelp();
      }
      break;
    default:
      break;
  }
};
