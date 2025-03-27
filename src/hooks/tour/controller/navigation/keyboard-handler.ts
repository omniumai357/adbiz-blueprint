
/**
 * Keyboard navigation handler for tour
 * Processes keyboard events and converts them to navigation actions
 */
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { parseNavigationAction } from './navigation-actions';
import { KeyboardHandlerOptions, NavigationAction } from './types';

/**
 * Handles keyboard navigation for tour steps
 * 
 * @param event Keyboard event from React or DOM
 * @param options Configuration options for keyboard navigation
 * @returns Navigation action to perform, or null if no action
 */
export const handleKeyNavigation = (
  event: ReactKeyboardEvent | KeyboardEvent, 
  options: KeyboardHandlerOptions
): NavigationAction | null => {
  // Don't handle events when tour is inactive
  if (!options.isActive) {
    return null;
  }

  // Don't handle events from input elements
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    event.target instanceof HTMLSelectElement
  ) {
    return null;
  }

  const { key, ctrlKey, metaKey, shiftKey } = event;

  // Enhanced keyboard shortcuts based on various keys
  switch (key) {
    // Basic navigation
    case 'ArrowRight':
    case 'ArrowDown':
      return options.isRTL ? 'previous_keyboard_shortcut' : 'next_keyboard_shortcut';
    
    case 'ArrowLeft':
    case 'ArrowUp':
      return options.isRTL ? 'next_keyboard_shortcut' : 'previous_keyboard_shortcut';

    // Additional navigation options
    case 'Enter':
    case ' ': // Space
      return 'next_keyboard_shortcut';
      
    case 'Escape':
      return 'escape';
      
    case 'End':
      return 'last_step';
      
    case 'Home':
      return 'first_step';
      
    case 'PageDown':
      return 'jump_forward';
      
    case 'PageUp':
      return 'jump_back';
      
    // Help shortcut
    case '?':
      if (shiftKey) {
        return 'show_shortcuts_help';
      }
      return null;
      
    // Additional keyboard shortcuts
    case 'n':
      if (!ctrlKey && !metaKey) {
        return 'next_keyboard_shortcut';
      }
      return null;
      
    case 'p':
      if (!ctrlKey && !metaKey) {
        return 'previous_keyboard_shortcut';
      }
      return null;
      
    case 's':
      if (!ctrlKey && !metaKey) {
        return 'skip_keyboard_shortcut';
      }
      return null;
  }

  return null;
};

/**
 * Hook to handle keyboard navigation for tour
 * 
 * @param isActive Whether the tour is active
 * @param handler Function to handle navigation actions
 * @param options Additional options for keyboard navigation
 */
export const useTourKeyboardNavigation = (
  isActive: boolean,
  handler: (event: ReactKeyboardEvent | KeyboardEvent, action: NavigationAction) => void,
  options: {
    enableHomeEndKeys?: boolean;
    enablePageKeys?: boolean;
    pageKeyJumpSize?: number;
    enableShortcutsHelp?: boolean;
  } = {}
) => {
  // Implementation will be kept in the existing file
  // This is just a re-export for better organization
};
