
/**
 * Setup file for responsive testing
 * 
 * This file contains utility functions and setup for responsive testing.
 * It provides helpers for setting viewport sizes, capturing screenshots,
 * and comparing visual snapshots across different breakpoints.
 */

import { BREAKPOINTS, Breakpoint } from "@/hooks/useResponsive";

/**
 * Standard test breakpoints based on our design system
 */
export const TEST_BREAKPOINTS = [
  { width: 375, height: 667, name: 'xs' },  // Mobile small
  { width: 640, height: 800, name: 'sm' },  // Mobile large
  { width: 768, height: 1024, name: 'md' }, // Tablet
  { width: 1024, height: 768, name: 'lg' }, // Small laptop
  { width: 1440, height: 900, name: 'xl' }, // Desktop
  { width: 1920, height: 1080, name: 'xxl' } // Large display
];

/**
 * Mock the window resize for testing responsive components
 * 
 * @param width - Window width in pixels
 * @param height - Window height in pixels
 */
export function mockWindowSize(width: number, height: number = 800): void {
  // Save original window properties
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;
  
  // Mock window dimensions
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
  
  // Add cleanup to restore original dimensions
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight
    });
  });
}

/**
 * Get a test viewport configuration by breakpoint name
 * 
 * @param breakpoint - Breakpoint name from our design system
 * @returns Viewport configuration with width and height
 */
export function getViewportByBreakpoint(breakpoint: Breakpoint): { width: number, height: number } {
  const testBreakpoint = TEST_BREAKPOINTS.find(bp => bp.name === breakpoint);
  
  if (testBreakpoint) {
    return { 
      width: testBreakpoint.width, 
      height: testBreakpoint.height 
    };
  }
  
  // Fallback values for unknown breakpoints
  return { 
    width: BREAKPOINTS[breakpoint] || 1024, 
    height: 768 
  };
}

/**
 * Helper function to generate a custom snapshot identifier
 * that includes component name and breakpoint
 * 
 * @param componentName - The name of the component being tested
 * @param breakpoint - Breakpoint name or custom identifier
 * @param state - Optional state identifier (e.g., "completed", "error")
 * @returns Formatted snapshot identifier string
 */
export function getSnapshotIdentifier(
  componentName: string, 
  breakpoint: string, 
  state?: string
): string {
  if (state) {
    return `${componentName}-${breakpoint}-${state}`;
  }
  
  return `${componentName}-${breakpoint}`;
}

/**
 * Wait for any animations to complete before taking snapshots
 * 
 * @param ms - Milliseconds to wait (default: 300ms)
 * @returns Promise that resolves after the specified delay
 */
export function waitForAnimations(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
