
/**
 * Parses the keyboard event to determine the navigation action to take
 * @param event Keyboard event
 * @param isFormElement Whether the target element is a form element
 * @returns The navigation action to take, or undefined if no action
 */
export function parseNavigationAction(
  event: KeyboardEvent,
  isFormElement: boolean
): string | undefined {
  // Don't process navigation for form elements
  if (isFormElement) {
    return undefined;
  }
  
  switch (event.key) {
    case 'ArrowRight':
      return 'next_keyboard_shortcut';
    case 'ArrowLeft':
      return 'previous_keyboard_shortcut';
    case 'Enter':
      // If the event target is a button or link, let it handle the enter key
      if (
        (event.target as HTMLElement)?.tagName?.toLowerCase() === 'button' ||
        (event.target as HTMLElement)?.tagName?.toLowerCase() === 'a'
      ) {
        return 'next_from_element';
      }
      return 'next_keyboard_shortcut';
    case 'Escape':
      return 'escape';
    default:
      return undefined;
  }
}

/**
 * Handle a navigation action based on the action name
 * @param action Navigation action name
 * @param handlers Object containing handler functions
 */
export function handleNavigationAction(
  action: string,
  handlers: {
    goToNext: () => void;
    goToPrevious: () => void;
    close: () => void;
    goToFirst?: () => void;
    goToLast?: () => void;
    jumpForward?: (steps: number) => void;
    jumpBackward?: (steps: number) => void;
    showShortcuts?: () => void;
  }
): void {
  switch (action) {
    case 'next_keyboard_shortcut':
    case 'next_from_element':
      handlers.goToNext();
      break;
    case 'previous_keyboard_shortcut':
      handlers.goToPrevious();
      break;
    case 'escape':
      handlers.close();
      break;
    case 'first_step':
      if (handlers.goToFirst) handlers.goToFirst();
      break;
    case 'last_step':
      if (handlers.goToLast) handlers.goToLast();
      break;
    case 'show_shortcuts_help':
      if (handlers.showShortcuts) handlers.showShortcuts();
      break;
    default:
      if (action.startsWith('jump_forward_') && handlers.jumpForward) {
        const steps = parseInt(action.replace('jump_forward_', ''), 10);
        if (!isNaN(steps)) handlers.jumpForward(steps);
      } else if (action.startsWith('jump_back_') && handlers.jumpBackward) {
        const steps = parseInt(action.replace('jump_back_', ''), 10);
        if (!isNaN(steps)) handlers.jumpBackward(steps);
      }
  }
}
