
import { useEffect } from 'react';
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { parseNavigationAction } from './controller/navigation/navigation-actions';

/**
 * Configuration options for keyboard navigation in tours
 */
export interface KeyboardNavigationOptions {
  /**
   * Enable Home/End keys for first/last step navigation
   * @default true
   */
  enableHomeEndKeys?: boolean;
  
  /**
   * Enable Page Up/Down keys for faster navigation
   * @default true
   */
  enablePageKeys?: boolean;
  
  /**
   * Number of steps to jump when using Page Up/Down keys
   * @default 3
   */
  pageKeyJumpSize?: number;
  
  /**
   * Enable question mark key for showing keyboard shortcuts help
   * @default true
   */
  enableShortcutsHelp?: boolean;
  
  /**
   * Enable tab trap within tour component
   * @default true
   */
  enableFocusTrap?: boolean;
}

/**
 * Hook to handle keyboard navigation for tours
 * 
 * @param isActive Whether the tour is active
 * @param handler Function to handle keyboard events
 * @param options Additional configuration options
 * @returns Object with keyboard navigation methods
 */
export function useTourKeyboardNavigation(
  isActive: boolean,
  handler: (event: KeyboardEvent | ReactKeyboardEvent, navigationAction?: string) => void,
  options: KeyboardNavigationOptions = {}
) {
  const isMobile = useIsMobile();
  
  // Set default options
  const {
    enableHomeEndKeys = true,
    enablePageKeys = true,
    pageKeyJumpSize = 3,
    enableShortcutsHelp = true,
    enableFocusTrap = true
  } = options;
  
  useEffect(() => {
    if (!isActive) return;
    
    const keyboardHandler = (event: KeyboardEvent) => {
      // Only process if tour is active and not when user is typing in form fields
      const tagName = (event.target as HTMLElement)?.tagName?.toLowerCase();
      const isFormElement = ['input', 'textarea', 'select'].includes(tagName);
      
      // Don't interfere with typing in form elements
      if (isActive && !isFormElement) {
        let navigationAction: string | undefined;
        
        // Determine the navigation action based on the key pressed
        if (enableHomeEndKeys && event.key === 'Home') {
          event.preventDefault();
          navigationAction = 'first_step';
        } else if (enableHomeEndKeys && event.key === 'End') {
          event.preventDefault();
          navigationAction = 'last_step';
        } else if (enablePageKeys && event.key === 'PageUp') {
          event.preventDefault();
          navigationAction = `jump_back_${pageKeyJumpSize}`;
        } else if (enablePageKeys && event.key === 'PageDown') {
          event.preventDefault();
          navigationAction = `jump_forward_${pageKeyJumpSize}`;
        } else if (enableShortcutsHelp && event.key === '?' && event.shiftKey) {
          event.preventDefault();
          navigationAction = 'show_shortcuts_help';
        } else {
          // Use the parseNavigationAction utility for other keys
          navigationAction = parseNavigationAction(event, isFormElement);
          
          if (navigationAction) {
            // Prevent default for navigation actions
            if (navigationAction !== 'next_from_element') {
              event.preventDefault();
            }
            
            // Dispatch custom events for some actions
            if (navigationAction === 'escape') {
              document.dispatchEvent(new CustomEvent('tour:escape'));
            } else if (navigationAction === 'next_keyboard_shortcut' || navigationAction === 'next_from_element') {
              document.dispatchEvent(new CustomEvent('tour:next'));
            } else if (navigationAction === 'previous_keyboard_shortcut') {
              document.dispatchEvent(new CustomEvent('tour:previous'));
            }
          }
        }
        
        // Pass the event and the navigation action to the handler
        if (navigationAction) {
          handler(event, navigationAction);
        }
      }
    };
    
    document.addEventListener('keydown', keyboardHandler);
    
    return () => {
      document.removeEventListener('keydown', keyboardHandler);
    };
  }, [isActive, handler, isMobile, enableHomeEndKeys, enablePageKeys, pageKeyJumpSize, enableShortcutsHelp, enableFocusTrap]);
  
  return {
    isKeyboardNavigationEnabled: isActive
  };
}

export default useTourKeyboardNavigation;
