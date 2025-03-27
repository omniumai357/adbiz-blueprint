
import { NavigationAction } from './types';

/**
 * Handle predefined navigation actions
 */
export function handleNavigationAction(
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
  } else if (action === 'next_from_element' || action === 'next_keyboard_shortcut') {
    nextStep();
  } else if (action === 'previous_keyboard_shortcut') {
    prevStep();
  } else if (action === 'skip_keyboard_shortcut') {
    // This should call endTour but we don't have it directly in this function
    // The caller should handle this action
  }
}

/**
 * Parse a navigation action from keyboard events
 */
export function parseNavigationAction(
  event: KeyboardEvent | React.KeyboardEvent,
  isFormElement: boolean
): NavigationAction | undefined {
  // Handle modifier keys for accessibility combinations
  const hasShiftKey = event.shiftKey;
  const hasAltKey = event.altKey;
  
  // Determine the navigation action based on the key pressed
  switch (event.key) {
    case 'Home':
      return 'first_step';
    case 'End':
      return 'last_step';
    case 'PageUp':
      return 'jump_back';
    case 'PageDown':
      return 'jump_forward';
    case '?':
      if (hasShiftKey) {
        return 'show_shortcuts_help';
      }
      break;
    case 'Escape':
      return 'escape';
    case ' ':
    case 'Enter':
      // Space or Enter can move to next step when focused on appropriate element
      if ((event.target as HTMLElement)?.getAttribute('data-tour-next') === 'true') {
        return 'next_from_element';
      }
      break;
    case 'n':
      // 'n' for next (when not in a form field)
      if (!isFormElement) {
        return 'next_keyboard_shortcut';
      }
      break;
    case 'p':
      // 'p' for previous (when not in a form field)
      if (!isFormElement) {
        return 'previous_keyboard_shortcut';
      }
      break;
    default:
      break;
  }

  // For any key command with Alt+Shift for accessibility
  if (hasAltKey && hasShiftKey) {
    switch (event.key) {
      case 'N': // Alt+Shift+N for Next
        return 'next_keyboard_shortcut';
      case 'P': // Alt+Shift+P for Previous
        return 'previous_keyboard_shortcut';
      case 'S': // Alt+Shift+S for Skip
        return 'skip_keyboard_shortcut';
      case 'H': // Alt+Shift+H for Help
        return 'show_shortcuts_help';
    }
  }
  
  return undefined;
}
