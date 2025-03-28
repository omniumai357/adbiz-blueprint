
import { Breakpoint, BREAKPOINTS } from "@/hooks/useResponsive";

/**
 * Helper functions for responsive design
 */

/**
 * Determines if the current viewport is at least the specified breakpoint
 * 
 * @param currentWidth The current viewport width
 * @param breakpoint The breakpoint to check against
 * @returns Boolean indicating if viewport is at or above the breakpoint
 * 
 * @example
 * // Returns true if viewport is at least md (768px)
 * isAtLeastBreakpoint(width, 'md')
 */
export const isAtLeastBreakpoint = (
  currentWidth: number, 
  breakpoint: Breakpoint
): boolean => {
  return currentWidth >= BREAKPOINTS[breakpoint];
};

/**
 * Determines if the current viewport is at most the specified breakpoint
 * 
 * @param currentWidth The current viewport width
 * @param breakpoint The breakpoint to check against
 * @returns Boolean indicating if viewport is at or below the breakpoint
 * 
 * @example
 * // Returns true if viewport is at most sm (less than 768px)
 * isAtMostBreakpoint(width, 'sm')
 */
export const isAtMostBreakpoint = (
  currentWidth: number, 
  breakpoint: Breakpoint
): boolean => {
  const nextBreakpoint = getNextBreakpoint(breakpoint);
  return nextBreakpoint ? currentWidth < BREAKPOINTS[nextBreakpoint] : true;
};

/**
 * Gets the next larger breakpoint from the provided breakpoint
 * 
 * @param breakpoint The current breakpoint
 * @returns The next larger breakpoint, or undefined if at largest breakpoint
 */
export const getNextBreakpoint = (breakpoint: Breakpoint): Breakpoint | undefined => {
  const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const index = breakpoints.indexOf(breakpoint);
  return index < breakpoints.length - 1 ? breakpoints[index + 1] : undefined;
};

/**
 * Gets the current active breakpoint based on window width
 * 
 * @param width The current viewport width
 * @returns The active breakpoint name
 */
export const getActiveBreakpoint = (width: number): Breakpoint => {
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS.xxl) return 'xl';
  return 'xxl';
};

/**
 * Gets a value based on the current breakpoint
 * 
 * @param breakpoint The current breakpoint
 * @param values Object mapping breakpoints to values
 * @param defaultValue Default value if no matching breakpoint
 * @returns The value for the current breakpoint
 * 
 * @example
 * // Returns appropriate padding based on breakpoint
 * const padding = getBreakpointValue(
 *   activeBreakpoint,
 *   { xs: 4, sm: 6, md: 8, lg: 10, xl: 12, xxl: 16 },
 *   8
 * )
 */
export const getBreakpointValue = <T>(
  breakpoint: Breakpoint,
  values: Partial<Record<Breakpoint, T>>,
  defaultValue: T
): T => {
  return values[breakpoint] !== undefined ? values[breakpoint]! : defaultValue;
};

/**
 * Calculates a value that scales fluidly between breakpoints
 * 
 * @param width Current viewport width
 * @param minWidth Minimum viewport width
 * @param maxWidth Maximum viewport width
 * @param minValue Value at minimum width
 * @param maxValue Value at maximum width
 * @returns Calculated value scaled between min and max
 * 
 * @example
 * // Returns a font size that scales from 16px at 320px to 24px at 1920px
 * const fontSize = fluidScale(width, 320, 1920, 16, 24)
 */
export const fluidScale = (
  width: number,
  minWidth: number,
  maxWidth: number,
  minValue: number,
  maxValue: number
): number => {
  // Clamp width between min and max
  const clampedWidth = Math.min(Math.max(width, minWidth), maxWidth);
  
  // Calculate the scale factor (0 to 1)
  const factor = (clampedWidth - minWidth) / (maxWidth - minWidth);
  
  // Calculate the scaled value
  return minValue + factor * (maxValue - minValue);
};
