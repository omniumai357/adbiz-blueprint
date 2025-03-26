
import { useCallback, useEffect } from 'react';

type NavigationAction = 
  | 'next'
  | 'previous'
  | 'first'
  | 'last'
  | 'close'
  | 'jump_forward'
  | 'jump_backward'
  | 'show_shortcuts_help';

type KeyboardOptions = {
  enableHomeEndKeys?: boolean;
  enablePageKeys?: boolean;
  pageKeyJumpSize?: number;
  enableShortcutsHelp?: boolean;
};

/**
 * Hook for keyboard navigation in tours
 */
export function useTourKeyboard(
  isActive: boolean,
  handleNavigationAction: (event: React.KeyboardEvent | KeyboardEvent, action: NavigationAction) => void,
  options?: KeyboardOptions
) {
  const {
    enableHomeEndKeys = true,
    enablePageKeys = true,
    pageKeyJumpSize = 3,
    enableShortcutsHelp = true
  } = options || {};

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

    // Convert DOM KeyboardEvent to a structure similar to React's KeyboardEvent
    const reactLikeEvent = {
      key: event.key,
      code: event.code,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation()
    };

    switch (event.key) {
      case 'ArrowRight':
      case 'n':
      case 'N':
        handleNavigationAction(reactLikeEvent as any, 'next');
        break;
        
      case 'ArrowLeft':
      case 'p':
      case 'P':
        handleNavigationAction(reactLikeEvent as any, 'previous');
        break;
        
      case 'Escape':
        handleNavigationAction(reactLikeEvent as any, 'close');
        break;
        
      case 'Home':
        if (enableHomeEndKeys) {
          handleNavigationAction(reactLikeEvent as any, 'first');
        }
        break;
        
      case 'End':
        if (enableHomeEndKeys) {
          handleNavigationAction(reactLikeEvent as any, 'last');
        }
        break;
        
      case 'PageDown':
        if (enablePageKeys) {
          handleNavigationAction(reactLikeEvent as any, 'jump_forward');
        }
        break;
        
      case 'PageUp':
        if (enablePageKeys) {
          handleNavigationAction(reactLikeEvent as any, 'jump_backward');
        }
        break;
        
      case '?':
        if (enableShortcutsHelp && event.shiftKey) {
          handleNavigationAction(reactLikeEvent as any, 'show_shortcuts_help');
          event.preventDefault();
        }
        break;
    }
  }, [isActive, handleNavigationAction, enableHomeEndKeys, enablePageKeys, enableShortcutsHelp]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Function to handle navigation from React components
  const handleKeyNavigation = useCallback((event: React.KeyboardEvent) => {
    if (!isActive) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'n':
      case 'N':
        handleNavigationAction(event, 'next');
        break;
        
      case 'ArrowLeft':
      case 'p':
      case 'P':
        handleNavigationAction(event, 'previous');
        break;
        
      case 'Escape':
        handleNavigationAction(event, 'close');
        break;
        
      case 'Home':
        if (enableHomeEndKeys) {
          handleNavigationAction(event, 'first');
        }
        break;
        
      case 'End':
        if (enableHomeEndKeys) {
          handleNavigationAction(event, 'last');
        }
        break;
        
      case 'PageDown':
        if (enablePageKeys) {
          handleNavigationAction(event, 'jump_forward');
        }
        break;
        
      case 'PageUp':
        if (enablePageKeys) {
          handleNavigationAction(event, 'jump_backward');
        }
        break;
        
      case '?':
        if (enableShortcutsHelp && event.shiftKey) {
          handleNavigationAction(event, 'show_shortcuts_help');
          event.preventDefault();
        }
        break;
    }
  }, [isActive, handleNavigationAction, enableHomeEndKeys, enablePageKeys, enableShortcutsHelp]);

  return {
    handleKeyNavigation
  };
}
