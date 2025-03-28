
/**
 * Responsive Testing Utilities
 * 
 * This file provides utilities for testing components at different viewport sizes
 * and standardizing the way we capture and verify responsive behavior.
 */

import { BREAKPOINTS, Breakpoint } from '@/hooks/useResponsive';

/**
 * Standard test viewports aligned with our breakpoints
 */
export const TEST_VIEWPORTS = {
  xs: { width: 375, height: 667 },  // Mobile small (iPhone SE)
  sm: { width: 640, height: 800 },  // Mobile large
  md: { width: 768, height: 1024 }, // Tablet
  lg: { width: 1024, height: 768 }, // Small laptop
  xl: { width: 1280, height: 800 }, // Desktop
  xxl: { width: 1920, height: 1080 } // Large display
};

/**
 * Returns the viewport dimensions for a given breakpoint
 * 
 * @param breakpoint Breakpoint to get dimensions for
 * @returns Viewport width and height
 */
export function getViewportForBreakpoint(breakpoint: Breakpoint): {width: number, height: number} {
  return TEST_VIEWPORTS[breakpoint] || TEST_VIEWPORTS.md;
}

/**
 * Mocks the window size for testing
 * 
 * @param width Window width to mock
 * @param height Window height to mock
 * @returns Cleanup function to restore original window size
 */
export function mockWindowSize(width: number, height: number): () => void {
  // Store original dimensions
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;
  
  // Mock dimensions
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
  
  // Return cleanup function
  return () => {
    Object.defineProperty(window, 'innerWidth', { value: originalWidth, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalHeight, writable: true });
    window.dispatchEvent(new Event('resize'));
  };
}

/**
 * Helper to generate a consistent snapshot identifier
 * 
 * @param componentName Name of the component being tested
 * @param breakpoint Breakpoint being tested
 * @param state Optional state descriptor (e.g., 'hover', 'active', 'error')
 * @returns Formatted snapshot identifier
 */
export function getSnapshotIdentifier(
  componentName: string,
  breakpoint: Breakpoint,
  state?: string
): string {
  if (state) {
    return `${componentName}-${breakpoint}-${state}`;
  }
  return `${componentName}-${breakpoint}`;
}

/**
 * Helper for running tests across multiple breakpoints
 * 
 * @param testName Name of the test
 * @param breakpoints Array of breakpoints to test
 * @param testFn Function to run for each breakpoint
 */
export function testAllBreakpoints(
  testName: string,
  breakpoints: Breakpoint[] = ['xs', 'md', 'xl'],
  testFn: (breakpoint: Breakpoint) => void
): void {
  describe(testName, () => {
    breakpoints.forEach((breakpoint) => {
      it(`at ${breakpoint} breakpoint (${TEST_VIEWPORTS[breakpoint].width}px)`, () => {
        testFn(breakpoint);
      });
    });
  });
}

/**
 * Waits for animations to complete before taking screenshots
 * 
 * @param ms Milliseconds to wait (default: 300ms)
 * @returns Promise that resolves after the wait period
 */
export function waitForAnimations(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gets appropriate component size based on breakpoint
 * 
 * @param breakpoint Current breakpoint
 * @returns Size descriptor ('sm', 'default', 'lg')
 */
export function getSizeForBreakpoint(breakpoint: Breakpoint): 'sm' | 'default' | 'lg' {
  if (breakpoint === 'xs' || breakpoint === 'sm') {
    return 'sm';
  } else if (breakpoint === 'xl' || breakpoint === 'xxl') {
    return 'lg';
  }
  return 'default';
}
