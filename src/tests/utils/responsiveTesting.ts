
/**
 * Responsive Testing Utilities
 * 
 * This module provides standardized utilities for testing responsive components
 * across different viewport sizes in both visual and functional tests.
 */

import { BREAKPOINTS, Breakpoint } from '@/hooks/useResponsive';
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';

/**
 * Standard viewport sizes for testing aligned with our design system breakpoints
 */
export const VIEWPORT_SIZES = {
  xs: { width: 375, height: 667 },  // Mobile small (iPhone SE)
  sm: { width: 640, height: 800 },  // Mobile large
  md: { width: 768, height: 1024 }, // Tablet
  lg: { width: 1024, height: 768 }, // Small laptop (landscape)
  xl: { width: 1280, height: 800 }, // Desktop
  xxl: { width: 1920, height: 1080 } // Large display
};

/**
 * Default settings for visual snapshot testing
 */
export const defaultSnapshotOptions: MatchImageSnapshotOptions = {
  // Threshold for pixel difference to trigger failure (1% by default)
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
  // Improve diff visualization
  comparisonMethod: 'ssim',
  // Custom directory for snapshot storage
  customSnapshotsDir: 'src/tests/__image_snapshots__',
  // Organized snapshots by component
  customDiffDir: 'src/tests/__image_snapshots__/__diff_output__',
};

/**
 * Device testing priority levels
 */
export enum TestPriority {
  Critical = 'P0',  // Must test before any release
  High = 'P1',      // Should test before major releases
  Medium = 'P2',    // Test periodically
  Low = 'P3'        // Test as resources allow
}

/**
 * Priority breakpoints to test based on usage analytics
 * Default test across mobile, tablet, and desktop
 */
export const PRIORITY_BREAKPOINTS: Breakpoint[] = ['xs', 'md', 'xl'];

/**
 * Returns the viewport dimensions for a given breakpoint
 */
export function getViewportForBreakpoint(breakpoint: Breakpoint): {width: number, height: number} {
  return VIEWPORT_SIZES[breakpoint] || VIEWPORT_SIZES.md;
}

/**
 * Mocks the window size for testing responsive components
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
 * @param breakpoints Array of breakpoints to test (defaults to priority breakpoints)
 * @param testFn Function to run for each breakpoint
 */
export function testAllBreakpoints(
  testName: string,
  breakpoints: Breakpoint[] = PRIORITY_BREAKPOINTS,
  testFn: (breakpoint: Breakpoint) => void
): void {
  describe(testName, () => {
    breakpoints.forEach((breakpoint) => {
      it(`at ${breakpoint} breakpoint (${VIEWPORT_SIZES[breakpoint].width}px)`, () => {
        testFn(breakpoint);
      });
    });
  });
}

/**
 * Waits for animations to complete before taking screenshots
 * Useful for visual testing to avoid capturing mid-animation states
 * 
 * @param ms Milliseconds to wait (default: 300ms)
 * @returns Promise that resolves after the wait period
 */
export function waitForAnimations(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gets appropriate component size based on breakpoint
 * Useful for components that need different sizes at different breakpoints
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
