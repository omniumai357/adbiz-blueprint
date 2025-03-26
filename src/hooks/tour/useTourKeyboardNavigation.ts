
import { useEffect } from 'react';

/**
 * Hook to handle keyboard navigation for tours
 * 
 * @param isActive Whether the tour is active
 * @param handler Function to handle keyboard events
 * @returns void
 */
export function useTourKeyboardNavigation(
  isActive: boolean,
  handler: (event: KeyboardEvent) => void
) {
  useEffect(() => {
    if (!isActive) return;
    
    const keyboardHandler = (event: KeyboardEvent) => {
      // Only process if tour is active and not when user is typing in form fields
      const tagName = (event.target as HTMLElement)?.tagName?.toLowerCase();
      const isFormElement = ['input', 'textarea', 'select'].includes(tagName);
      
      if (isActive && !isFormElement) {
        handler(event);
        
        // Handle additional accessibility shortcuts
        switch (event.key) {
          case 'Escape':
            // Adding specific keyboard behavior for escape key
            document.dispatchEvent(new CustomEvent('tour:escape'));
            break;
          case ' ':
          case 'Enter':
            // Space or Enter can move to next step when focused on appropriate element
            if ((event.target as HTMLElement)?.getAttribute('data-tour-next') === 'true') {
              event.preventDefault();
              document.dispatchEvent(new CustomEvent('tour:next'));
            }
            break;
          default:
            // Let other keys be handled by the main handler
            break;
        }
      }
    };
    
    document.addEventListener('keydown', keyboardHandler);
    
    return () => {
      document.removeEventListener('keydown', keyboardHandler);
    };
  }, [isActive, handler]);
}

export default useTourKeyboardNavigation;
