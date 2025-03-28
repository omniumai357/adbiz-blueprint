
import { useState, useEffect, useMemo } from "react";
import { createComponentLogger } from "@/lib/utils/logging";

const logger = createComponentLogger('useMediaQuery');

/**
 * Enhanced hook to handle media queries for responsive design
 * 
 * Features:
 * - SSR compatibility
 * - Error handling
 * - Performance optimized
 * - Proper cleanup of event listeners
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
      
      // Add event listener using the modern API
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
 * Hook that returns media query matches for Tailwind's default breakpoints
 * 
 * @returns Object with boolean values for common breakpoints
 */
export function useBreakpoints() {
  const sm = useMediaQuery("(min-width: 640px)");
  const md = useMediaQuery("(min-width: 768px)");
  const lg = useMediaQuery("(min-width: 1024px)");
  const xl = useMediaQuery("(min-width: 1280px)");
  const xxl = useMediaQuery("(min-width: 1536px)");
  
  const isMobile = !md;  // < md
  const isTablet = md && !lg;  // md-lg
  const isDesktop = lg;  // ≥ lg
  const isLargeDesktop = xl; // ≥ xl
  const isLandscape = useMediaQuery("(orientation: landscape)");
  
  // Memoize result to avoid unnecessary re-renders
  return useMemo(() => ({
    breakpoints: { sm, md, lg, xl, xxl },
    isMobile,
    isTablet, 
    isDesktop,
    isLargeDesktop,
    isLandscape,
    isPortrait: !isLandscape,
    
    // Comparison helpers
    atLeast: {
      sm,
      md,
      lg,
      xl,
      xxl
    },
    atMost: {
      sm: !sm,
      md: !md,
      lg: !lg,
      xl: !xl,
      xxl: !xxl
    }
  }), [sm, md, lg, xl, xxl, isMobile, isTablet, isDesktop, isLargeDesktop, isLandscape]);
}
