
/**
 * Responsive Testing Utilities
 * 
 * Common utilities for responsive testing across both visual and functional tests.
 */

import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { BREAKPOINTS, Breakpoint } from '@/hooks/useResponsive';

/**
 * Standard test viewport sizes
 */
export const VIEWPORT_SIZES = {
  xs: { width: 375, height: 667 },  // Mobile small (iPhone SE)
  sm: { width: 640, height: 800 },  // Mobile large
  md: { width: 768, height: 1024 }, // Tablet
  lg: { width: 1024, height: 768 }, // Small laptop
  xl: { width: 1280, height: 800 }, // Desktop
  xxl: { width: 1920, height: 1080 } // Large display
};

/**
 * Priority breakpoints to test when resources are limited
 */
export const PRIORITY_BREAKPOINTS: Breakpoint[] = ['xs', 'md', 'xl'];

/**
 * Default options for image snapshot testing
 */
export const defaultSnapshotOptions: MatchImageSnapshotOptions = {
  failureThreshold: 0.01, // 1% threshold for differences
  failureThresholdType: 'percent',
  comparisonMethod: 'ssim',
  customDiffConfig: {
    threshold: 0.1
  },
  blur: 1, // Apply slight blur to reduce noise from anti-aliasing differences
  allowSizeMismatch: false
};

/**
 * Get viewport dimensions for a specific breakpoint
 */
export function getViewportForBreakpoint(breakpoint: Breakpoint): { width: number; height: number } {
  return VIEWPORT_SIZES[breakpoint] || VIEWPORT_SIZES.md;
}

/**
 * Creates a standardized snapshot identifier for component testing
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
 * Mock window size for testing responsive components in jsdom
 */
export function mockWindowSize(width: number, height: number): () => void {
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;
  
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
 * Wait for any animations to complete before taking screenshots
 */
export function waitForAnimations(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
