
import { useState, useEffect, useMemo } from "react";
import { createComponentLogger } from "@/lib/utils/logging";

const logger = createComponentLogger('useMediaQuery');

/**
 * Hook to handle media queries for responsive design
 * 
 * @param query CSS media query string
 * @returns Boolean indicating whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Avoid running matchMedia during SSR
  const getMatches = (): boolean => {
    // Prevent SSR issues
    if (typeof window !== 'undefined') {
      try {
        return window.matchMedia(query).matches;
      } catch (err) {
        logger.error('Error checking media query', { query, error: err });
        return false;
      }
    }
    return false;
  };

  // Initialize with the correct value
  const [matches, setMatches] = useState<boolean>(getMatches);

  // Update matches state only when the media query changes
  useEffect(() => {
    // Set initial value
    setMatches(getMatches());

    try {
      const mediaQuery = window.matchMedia(query);
      
      // Define handler
      const handler = (): void => setMatches(mediaQuery.matches);
      
      // Add event listener using the standard API
      mediaQuery.addEventListener("change", handler);
      
      // Clean up
      return () => {
        mediaQuery.removeEventListener("change", handler);
      };
    } catch (err) {
      logger.error('Error setting up media query listener', { query, error: err });
      return () => {};
    }
  }, [query]);

  return matches;
}

/**
 * Hook that returns media query matches for common breakpoints
 * Using Tailwind's default breakpoints
 * 
 * @returns Object with boolean values for common breakpoints
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery("(max-width: 639px)");  // < sm
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");  // sm-lg
  const isDesktop = useMediaQuery("(min-width: 1024px)");  // >= lg
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)"); // >= xl
  const isLandscape = useMediaQuery("(orientation: landscape)");
  
  // Memoize result to avoid unnecessary re-renders
  return useMemo(() => ({
    isMobile,
    isTablet, 
    isDesktop,
    isLargeDesktop,
    isLandscape,
    isPortrait: !isLandscape
  }), [isMobile, isTablet, isDesktop, isLargeDesktop, isLandscape]);
}
