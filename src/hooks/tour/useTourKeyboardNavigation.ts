
import { useEffect } from 'react';
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
}

/**
 * Hook to handle keyboard navigation for tours
 * 
 * @param isActive Whether the tour is active
 * @param handler Function to handle keyboard events
 * @param options Additional configuration options
 * @returns void
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
    enableShortcutsHelp = true
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
        switch (event.key) {
          case 'Home':
            if (enableHomeEndKeys) {
              event.preventDefault();
              navigationAction = 'first_step';
            }
            break;
          case 'End':
            if (enableHomeEndKeys) {
              event.preventDefault();
              navigationAction = 'last_step';
            }
            break;
          case 'PageUp':
            if (enablePageKeys) {
              event.preventDefault();
              navigationAction = `jump_back_${pageKeyJumpSize}`;
            }
            break;
          case 'PageDown':
            if (enablePageKeys) {
              event.preventDefault();
              navigationAction = `jump_forward_${pageKeyJumpSize}`;
            }
            break;
          case '?':
            if (enableShortcutsHelp && event.shiftKey) {
              event.preventDefault();
              navigationAction = 'show_shortcuts_help';
            }
            break;
          case 'Escape':
            // Adding specific keyboard behavior for escape key
            document.dispatchEvent(new CustomEvent('tour:escape'));
            navigationAction = 'escape';
            break;
          case ' ':
          case 'Enter':
            // Space or Enter can move to next step when focused on appropriate element
            if ((event.target as HTMLElement)?.getAttribute('data-tour-next') === 'true') {
              event.preventDefault();
              document.dispatchEvent(new CustomEvent('tour:next'));
              navigationAction = 'next_from_element';
            }
            break;
          default:
            // Let other keys be handled without specific navigation action
            break;
        }
        
        // Pass the event and the navigation action to the handler
        handler(event, navigationAction);
      }
    };
    
    document.addEventListener('keydown', keyboardHandler);
    
    return () => {
      document.removeEventListener('keydown', keyboardHandler);
    };
  }, [isActive, handler, isMobile, enableHomeEndKeys, enablePageKeys, pageKeyJumpSize, enableShortcutsHelp]);
}

export default useTourKeyboardNavigation;
