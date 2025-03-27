
/**
 * Utility functions for handling navigation actions in tour
 */
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { NavigationAction, NavigationHandler, KeyboardHandlerOptions } from './types';

/**
 * Parse a navigation action string into a function call on the navigation handler
 * 
 * @param action The navigation action to parse
 * @param options The keyboard handler options containing handler functions and state
 * @returns Whether the action was handled successfully
 */
export const parseNavigationAction = (
  action: NavigationAction,
  options: KeyboardHandlerOptions
): boolean => {
  const { 
    handlers, 
    currentStep, 
    totalSteps, 
    currentPath,
    tourPaths, 
    visibleSteps,
    userId,
    userType
  } = options;

  const jumpSize = 3; // Default jump size for page up/down

  switch (action) {
    case 'next_keyboard_shortcut':
    case 'next_from_element':
      handlers.nextStep();
      return true;

    case 'previous_keyboard_shortcut':
      handlers.prevStep();
      return true;

    case 'skip_keyboard_shortcut':
    case 'escape':
      handlers.endTour();
      return true;

    case 'first_step':
      if (currentStep !== 0) {
        handlers.goToStep(0);
        return true;
      }
      return false;

    case 'last_step':
      if (currentStep !== totalSteps - 1) {
        handlers.goToStep(totalSteps - 1);
        return true;
      }
      return false;

    case 'jump_forward':
      if (currentStep + jumpSize < totalSteps) {
        handlers.goToStep(currentStep + jumpSize);
        return true;
      } else if (currentStep !== totalSteps - 1) {
        handlers.goToStep(totalSteps - 1);
        return true;
      }
      return false;

    case 'jump_back':
      if (currentStep - jumpSize >= 0) {
        handlers.goToStep(currentStep - jumpSize);
        return true;
      } else if (currentStep !== 0) {
        handlers.goToStep(0);
        return true;
      }
      return false;
      
    case 'show_shortcuts_help':
      if (handlers.showKeyboardShortcutsHelp) {
        handlers.showKeyboardShortcutsHelp();
        return true;
      }
      return false;

    default:
      return false;
  }
};

/**
 * Handle a navigation action triggered by the user
 * 
 * @param event The original event that triggered the action
 * @param action The navigation action to perform
 * @param options The keyboard handler options
 * @returns Whether the action was handled
 */
export const handleNavigationAction = (
  event: ReactKeyboardEvent | KeyboardEvent | null,
  action: NavigationAction,
  options: KeyboardHandlerOptions
): boolean => {
  // Prevent default browser behavior for keyboard events
  if (event) {
    event.preventDefault();
  }

  // Track the interaction
  const { 
    handlers, 
    currentPath, 
    tourPaths, 
    currentStep, 
    visibleSteps,
    userId,
    userType 
  } = options;
  
  if (currentPath && handlers.trackInteraction) {
    const pathData = tourPaths.find(path => path.id === currentPath);
    const currentStepData = visibleSteps[currentStep];
    
    if (pathData && currentStepData) {
      handlers.trackInteraction(
        pathData,
        currentStepData,
        currentStep,
        `navigation_action_${action}`,
        userId,
        userType
      );
    }
  }

  // Parse and execute the action
  return parseNavigationAction(action, options);
};
