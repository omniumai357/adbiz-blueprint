
import { useState, useEffect, useMemo } from 'react';
import { useDevice } from './use-device';

// Breakpoint definitions
export const BREAKPOINTS = {
  xs: 480,   // Extra small devices
  sm: 640,   // Small devices
  md: 768,   // Medium devices
  lg: 1024,  // Large devices
  xl: 1280,  // Extra large devices
  xxl: 1536  // Extra extra large devices
};

// Type for breakpoint names
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Hook for responsive design decisions
 * Provides responsive variables and helper functions
 */
export function useResponsive() {
  const device = useDevice();
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('md');
  
  // Determine active breakpoint based on screen width
  useEffect(() => {
    const width = device.dimensions.width;
    
    if (width < BREAKPOINTS.sm) {
      setActiveBreakpoint('xs');
    } else if (width < BREAKPOINTS.md) {
      setActiveBreakpoint('sm');
    } else if (width < BREAKPOINTS.lg) {
      setActiveBreakpoint('md');
    } else if (width < BREAKPOINTS.xl) {
      setActiveBreakpoint('lg');
    } else if (width < BREAKPOINTS.xxl) {
      setActiveBreakpoint('xl');
    } else {
      setActiveBreakpoint('xxl');
    }
  }, [device.dimensions.width]);

  // Create derived breakpoint states for component use
  const breakpointFlags = useMemo(() => {
    const width = device.dimensions.width;
    return {
      isXs: width < BREAKPOINTS.sm,
      isSm: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
      isMd: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isLg: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
      isXl: width >= BREAKPOINTS.xl && width < BREAKPOINTS.xxl,
      isXxl: width >= BREAKPOINTS.xxl,
    };
  }, [device.dimensions.width]);
  
  // Responsive comparison helpers
  const comparisonHelpers = useMemo(() => ({
    atLeast: {
      xs: true, // xs or larger (always true)
      sm: device.dimensions.width >= BREAKPOINTS.sm,
      md: device.dimensions.width >= BREAKPOINTS.md,
      lg: device.dimensions.width >= BREAKPOINTS.lg,
      xl: device.dimensions.width >= BREAKPOINTS.xl,
      xxl: device.dimensions.width >= BREAKPOINTS.xxl
    },
    atMost: {
      xs: device.dimensions.width < BREAKPOINTS.sm,
      sm: device.dimensions.width < BREAKPOINTS.md,
      md: device.dimensions.width < BREAKPOINTS.lg,
      lg: device.dimensions.width < BREAKPOINTS.xl,
      xl: device.dimensions.width < BREAKPOINTS.xxl,
      xxl: true // xxl or smaller (always true)
    }
  }), [device.dimensions.width]);
  
  return {
    // Screen orientation
    isPortrait: device.isPortrait,
    isLandscape: device.isLandscape,
    
    // Device types
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
    
    // Screen dimensions
    screenWidth: device.dimensions.width,
    screenHeight: device.dimensions.height,
    
    // High DPI detection
    isHighDPI: device.highDPI,
    
    // Touch capability
    hasTouchCapability: device.hasTouchCapability,
    
    // Add activeBreakpoint property
    activeBreakpoint,
    
    // Add breakpoint-specific flags
    ...breakpointFlags,
    
    // Add comparison helpers
    ...comparisonHelpers,
    
    // Alias for backwards compatibility
    hasTouchSupport: device.hasTouchCapability
  };
}
