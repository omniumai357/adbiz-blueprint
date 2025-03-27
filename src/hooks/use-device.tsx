
import { useState, useEffect, useMemo } from "react";
import { logger } from "@/utils/logger";

// Device breakpoints in pixels - standardized across the application
export const BREAKPOINTS = {
  xs: 480,   // Extra small devices
  sm: 640,   // Small devices
  md: 768,   // Medium devices
  lg: 1024,  // Large devices
  xl: 1280,  // Extra large devices
  xxl: 1536  // Extra extra large devices
};

/**
 * Enhanced hook for device type detection with capabilities
 * 
 * @returns Object with device type and capability flags
 */
export function useDevice() {
  const [devicePixelRatio, setDevicePixelRatio] = useState<number>(
    typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  );
  
  const [hasTouchCapability, setHasTouchCapability] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  // Initialize device capabilities on mount
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;
    
    // Detect touch capability
    setHasTouchCapability('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Get device pixel ratio for high-DPI screens
    setDevicePixelRatio(window.devicePixelRatio || 1);
    
    // Set initial window dimensions
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
    // Handle window resize
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Handle changes to device pixel ratio (rare but possible)
    const handlePixelRatioChange = () => {
      setDevicePixelRatio(window.devicePixelRatio || 1);
    };
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Media query for detecting changes to device pixel ratio
    try {
      const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      mediaQuery.addEventListener("change", handlePixelRatioChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        mediaQuery.removeEventListener("change", handlePixelRatioChange);
      };
    } catch (err) {
      logger.warn("Device pixel ratio monitoring not supported", {
        context: "useDevice",
        data: { error: err }
      });
      
      // Cleanup resize listener only
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);
  
  // Derived breakpoint states
  const breakpoints = useMemo(() => {
    const width = windowDimensions.width;
    return {
      isXs: width < BREAKPOINTS.sm,
      isSm: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
      isMd: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isLg: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
      isXl: width >= BREAKPOINTS.xl && width < BREAKPOINTS.xxl,
      isXxl: width >= BREAKPOINTS.xxl,
      // Combined breakpoints for convenience
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      isLargeDesktop: width >= BREAKPOINTS.xl
    };
  }, [windowDimensions.width]);
  
  // Orientation detection
  const isPortrait = windowDimensions.height > windowDimensions.width;
  
  // Device capabilities
  const capabilities = useMemo(() => ({
    touch: hasTouchCapability,
    highDPI: devicePixelRatio >= 2,
    ultraHighDPI: devicePixelRatio >= 3,
    portrait: isPortrait,
    landscape: !isPortrait,
    // Raw dimensions for custom calculations
    width: windowDimensions.width,
    height: windowDimensions.height
  }), [hasTouchCapability, devicePixelRatio, isPortrait, windowDimensions]);
  
  // Log device information in development (once)
  useEffect(() => {
    logger.debug("Device information", {
      context: "useDevice",
      data: {
        ...breakpoints,
        ...capabilities,
        devicePixelRatio
      }
    });
  }, []);
  
  return {
    // Breakpoint flags
    ...breakpoints,
    
    // Orientation
    isPortrait,
    isLandscape: !isPortrait,
    
    // Capabilities
    ...capabilities,
    
    // Raw values for custom logic
    devicePixelRatio,
    hasTouchCapability,
    
    // Window dimensions
    dimensions: windowDimensions
  };
}

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useDevice() instead
 */
export function useIsMobile() {
  const { isMobile } = useDevice();
  return isMobile;
}

/**
 * Simple hook for media query matching
 * @param query CSS media query string
 * @returns Boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;
    
    // Create the media query
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Define callback
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    try {
      // Modern browsers
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (err) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);
  
  return matches;
}
