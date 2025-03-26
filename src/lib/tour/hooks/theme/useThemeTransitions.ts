
import { useCallback, useState } from "react";

/**
 * Hook to manage theme transitions
 * @returns Theme transition state and functions
 */
export function useThemeTransitions() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * Apply transition properties to document
   * @param duration Transition duration in ms
   * @param easing Easing function
   * @returns Cleanup function
   */
  const applyTransition = useCallback((
    duration: number = 300, 
    easing: string = 'ease'
  ) => {
    setIsTransitioning(true);
    
    // Apply transition styles
    document.documentElement.style.setProperty('--tour-transition-duration', `${duration}ms`);
    document.documentElement.style.setProperty('--tour-transition-easing', easing);
    document.documentElement.classList.add('tour-theme-transitioning');
    
    // Return a function to clear the transition after it completes
    return () => {
      setTimeout(() => {
        document.documentElement.classList.remove('tour-theme-transitioning');
        setIsTransitioning(false);
      }, duration);
    };
  }, []);

  return {
    isTransitioning,
    applyTransition
  };
}
