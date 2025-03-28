
/**
 * Visual Regression Testing Setup
 * 
 * This module configures the testing environment for visual regression tests
 * using jest-image-snapshot. It provides utilities for capturing and comparing
 * component snapshots across different viewport sizes.
 */

// Import jest-image-snapshot types for TypeScript support
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { BREAKPOINTS, Breakpoint } from '@/hooks/useResponsive';
// Add import for render from testing library
import { render } from '@testing-library/react';
import { 
  VIEWPORT_SIZES, 
  defaultSnapshotOptions, 
  PRIORITY_BREAKPOINTS,
  getSnapshotIdentifier
} from '../utils/responsiveTesting';

// Re-export utilities from responsiveTesting for test files to use
export { defaultSnapshotOptions, getSnapshotIdentifier, PRIORITY_BREAKPOINTS };

/**
 * Configure jest-image-snapshot for responsive component testing
 */
export const configureToMatchImageSnapshot = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { toMatchImageSnapshot } = require('jest-image-snapshot');
  
  // Add the custom matcher to Jest
  expect.extend({ toMatchImageSnapshot });
};

/**
 * Helper function to get viewport size by breakpoint name
 */
export const getViewportByBreakpoint = (breakpoint: Breakpoint): { width: number, height: number } => {
  return VIEWPORT_SIZES[breakpoint] || VIEWPORT_SIZES.lg;
};

/**
 * Generate a set of test cases for all breakpoints
 * 
 * @param testName Base name for the test
 * @param breakpoints Array of breakpoint keys to test
 * @param testFn Function that runs the test with the given breakpoint
 */
export const testAllBreakpoints = (
  testName: string,
  breakpoints: Breakpoint[] = PRIORITY_BREAKPOINTS,
  testFn: (breakpoint: Breakpoint) => void
): void => {
  describe(testName, () => {
    breakpoints.forEach(breakpoint => {
      it(`at ${breakpoint} breakpoint (${VIEWPORT_SIZES[breakpoint].width}px)`, () => {
        testFn(breakpoint);
      });
    });
  });
};

/**
 * Create a visual test for a component at multiple breakpoints
 * 
 * @param componentName Name of the component being tested
 * @param renderComponent Function that renders the component with the given breakpoint
 * @param breakpoints Array of breakpoints to test (defaults to xs, md, xl)
 * @param options Additional options for snapshot testing
 */
export const createResponsiveVisualTests = (
  componentName: string,
  renderComponent: (breakpoint: Breakpoint) => JSX.Element,
  breakpoints: Breakpoint[] = PRIORITY_BREAKPOINTS,
  options: Partial<MatchImageSnapshotOptions> = {}
): void => {
  describe(`${componentName} visual tests`, () => {
    breakpoints.forEach(breakpoint => {
      it(`renders correctly at ${breakpoint} breakpoint`, () => {
        // Render the component
        const { container } = render(renderComponent(breakpoint));
        
        // Take and compare snapshot
        expect(container).toMatchImageSnapshot({
          ...defaultSnapshotOptions,
          ...options,
          customSnapshotIdentifier: getSnapshotIdentifier(componentName, breakpoint)
        });
      });
    });
  });
};
