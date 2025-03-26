
import { useState, useEffect } from "react";

/**
 * Hook to handle media queries for responsive design
 * 
 * @param query CSS media query string
 * @returns Boolean indicating whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia(query);
      
      // Set initial value
      setMatches(mediaQuery.matches);
      setInitialized(true);

      // Define callback
      const handler = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add event listener
      mediaQuery.addEventListener("change", handler);
      
      // Clean up
      return () => {
        mediaQuery.removeEventListener("change", handler);
      };
    } catch (err) {
      console.error("Error creating media query:", err);
      // Fall back to false if there's an error
      setMatches(false);
      setInitialized(true);
      return () => {};
    }
  }, [query]);

  // Return false until the hook is fully initialized to prevent layout shifts
  return initialized ? matches : false;
}

/**
 * Hook that returns media query matches for common breakpoints
 * 
 * @returns Object with boolean values for common breakpoints
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery("(max-width: 639px)");  // < sm
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");  // sm-lg
  const isDesktop = useMediaQuery("(min-width: 1024px)");  // >= lg
  const isLandscape = useMediaQuery("(orientation: landscape)");
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLandscape,
    isPortrait: !isLandscape
  };
}
