
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
 * Default options for image snapshot testing
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
 * Standard viewport sizes for testing based on our breakpoints
 */
export const VIEWPORT_SIZES = {
  xs: { width: 375, height: 667 },  // iPhone SE
  sm: { width: 640, height: 800 },  // Small tablet / large phone
  md: { width: 768, height: 1024 }, // iPad
  lg: { width: 1024, height: 768 }, // Landscape iPad / small laptop
  xl: { width: 1280, height: 800 }, // Laptop
  xxl: { width: 1920, height: 1080 } // Large desktop
};

/**
 * Generate snapshot identifier with device and state information
 */
export const getSnapshotIdentifier = (
  componentName: string,
  breakpoint: Breakpoint,
  stateName = 'default'
): string => {
  return `${componentName}-${breakpoint}-${stateName}`;
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
  breakpoints: Breakpoint[] = ['xs', 'md', 'xl'],
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
  breakpoints: Breakpoint[] = ['xs', 'md', 'xl'],
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
