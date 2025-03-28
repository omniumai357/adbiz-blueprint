
import { useMemo } from 'react';
import { useMediaQuery } from './use-media-query';
import { createComponentLogger } from "@/lib/utils/logging";

const logger = createComponentLogger('useResponsive');

// Standard breakpoint definitions (aligned with Tailwind)
export const BREAKPOINTS = {
  xs: 480,    // Extra small devices (portrait phones)
  sm: 640,    // Small devices (landscape phones)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (laptops/desktops)
  xl: 1280,   // Extra large devices (large desktops)
  xxl: 1536   // Extra extra large devices (ultra-wide)
};

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Enhanced hook for responsive design that provides:
 * - Standardized breakpoints aligned with Tailwind
 * - Device type detection 
 * - Orientation detection
 * - Memoized values to prevent unnecessary re-renders
 * 
 * @returns Object with various responsive helpers
 */
export function useResponsive() {
  // Base media queries - fully memoized to prevent unnecessary re-renders
  const isXs = useMediaQuery(`(max-width: ${BREAKPOINTS.sm - 1}px)`);
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px) and (max-width: ${BREAKPOINTS.xxl - 1}px)`);
  const isXxl = useMediaQuery(`(min-width: ${BREAKPOINTS.xxl}px)`);
  
  // Composite media queries
  const isMobile = isXs || isSm; // <768px
  const isTablet = isMd; // 768-1023px
  const isDesktop = isLg || isXl || isXxl; // ≥1024px
  const isLargeDesktop = isXl || isXxl; // ≥1280px
  
  // Orientation
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isPortrait = !isLandscape;

  // Device capabilities (client-side only)
  const hasTouchSupport = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      // @ts-ignore - MS specific prefixed implementation detection
      (window.DocumentTouch && document instanceof DocumentTouch);
  }, []);
  
  // Current active breakpoint
  const activeBreakpoint = useMemo((): Breakpoint => {
    if (isXxl) return 'xxl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
  }, [isXs, isSm, isMd, isLg, isXl, isXxl]);

  // Comparison helpers
  const atLeast = useMemo(() => ({
    sm: !isXs,
    md: !isXs && !isSm,
    lg: isLg || isXl || isXxl,
    xl: isXl || isXxl,
    xxl: isXxl
  }), [isXs, isSm, isMd, isLg, isXl, isXxl]);

  const atMost = useMemo(() => ({
    xs: isXs,
    sm: isXs || isSm,
    md: isXs || isSm || isMd,
    lg: isXs || isSm || isMd || isLg,
    xl: isXs || isSm || isMd || isLg || isXl
  }), [isXs, isSm, isMd, isLg, isXl]);

  // Return memoized object to prevent unnecessary re-renders in consumers
  return useMemo(() => ({
    // Direct breakpoint checks
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
    
    // Composite helpers
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    
    // Orientation
    isLandscape,
    isPortrait,
    
    // Device capabilities
    hasTouchSupport,
    
    // Meta information
    activeBreakpoint,
    
    // Comparison helpers
    atLeast,
    atMost,
    
    // Raw breakpoint values for calculations
    breakpoints: BREAKPOINTS
  }), [
    isXs, isSm, isMd, isLg, isXl, isXxl,
    isMobile, isTablet, isDesktop, isLargeDesktop,
    isLandscape, isPortrait,
    hasTouchSupport,
    activeBreakpoint,
    atLeast, atMost
  ]);
}

/**
 * Helper function to get responsive value based on current breakpoint
 * 
 * @example
 * // Returns 'compact' on mobile, 'default' on tablet, 'expanded' on desktop
 * const layout = getResponsiveValue({
 *   default: 'default',
 *   mobile: 'compact',
 *   desktop: 'expanded'
 * }, activeBreakpoint);
 * 
 * @param values Object with values for different breakpoints
 * @param currentBreakpoint Current active breakpoint
 * @returns The appropriate value for the current breakpoint
 */
export function getResponsiveValue<T>(
  values: {
    default: T;
    mobile?: T;
    tablet?: T;
    desktop?: T;
    largeDesktop?: T;
  },
  currentBreakpoint: Breakpoint
): T {
  // Priority ordering for selecting responsive value
  if (
    (currentBreakpoint === 'xs' || currentBreakpoint === 'sm') && 
    values.mobile !== undefined
  ) {
    return values.mobile;
  }
  
  if (
    currentBreakpoint === 'md' && 
    values.tablet !== undefined
  ) {
    return values.tablet;
  }
  
  if (
    (currentBreakpoint === 'lg' || currentBreakpoint === 'xl') && 
    values.desktop !== undefined
  ) {
    return values.desktop;
  }
  
  if (
    (currentBreakpoint === 'xl' || currentBreakpoint === 'xxl') && 
    values.largeDesktop !== undefined
  ) {
    return values.largeDesktop;
  }
  
  // Fall back to default value if no specific breakpoint value is provided
  return values.default;
}
