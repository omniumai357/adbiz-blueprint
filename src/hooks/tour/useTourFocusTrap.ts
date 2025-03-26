
import { useEffect, useRef } from 'react';

/**
 * Hook that traps focus within the tour component
 * ensuring focus stays within the component when tabbing.
 *
 * @param isActive Whether the tour is active
 * @param containerRef Reference to the tour container element
 * @param enabled Whether focus trap is enabled
 */
export function useTourFocusTrap(
  isActive: boolean,
  containerRef: React.RefObject<HTMLElement>,
  enabled: boolean = true
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !enabled || !containerRef.current) return;

    // Store the current active element to restore focus later
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      if (!containerRef.current) return [];
      
      return Array.from(
        containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !el.hasAttribute('disabled') && 
                !el.getAttribute('aria-hidden') && 
                el.getBoundingClientRect().width > 0
      ) as HTMLElement[];
    };
    
    // Set initial focus to the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length) {
      setTimeout(() => {
        focusableElements[0].focus();
      }, 100);
    }

    // Add a class to the body to improve focus visibility
    document.body.classList.add('tour-focus-active');

    // Handle tabbing to maintain focus within the container
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;
      
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;
      
      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];
      
      // Shift+Tab from first element should loop to the last
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
      // Tab from last element should loop to the first
      else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      
      // Remove focus class from body
      document.body.classList.remove('tour-focus-active');

      // Restore focus when the trap is deactivated
      if (previousFocusRef.current && document.body.contains(previousFocusRef.current)) {
        try {
          previousFocusRef.current.focus();
        } catch (e) {
          console.warn('Could not restore focus to previous element:', e);
        }
      }
    };
  }, [isActive, containerRef, enabled]);
}

export default useTourFocusTrap;
