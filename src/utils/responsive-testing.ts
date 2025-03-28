
import { BREAKPOINTS, Breakpoint } from '@/hooks/useResponsive';

/**
 * Convert a breakpoint name to viewport dimensions
 * 
 * @param breakpoint The breakpoint name
 * @returns Object with width and height
 */
export const getViewportForBreakpoint = (breakpoint: Breakpoint): { width: number; height: number } => {
  switch (breakpoint) {
    case 'xs':
      return { width: BREAKPOINTS.xs - 1, height: 667 }; // iPhone SE size
    case 'sm':
      return { width: BREAKPOINTS.sm, height: 812 }; // iPhone X size
    case 'md':
      return { width: BREAKPOINTS.md, height: 1024 }; // iPad size
    case 'lg':
      return { width: BREAKPOINTS.lg, height: 900 }; // Laptop size
    case 'xl':
      return { width: BREAKPOINTS.xl, height: 1080 }; // Desktop size
    case 'xxl':
      return { width: BREAKPOINTS.xxl, height: 1200 }; // Large desktop size
    default:
      return { width: 1024, height: 768 }; // Default fallback
  }
};

/**
 * Test a function at multiple breakpoints
 * 
 * @param testName The name of the test
 * @param breakpoints Array of breakpoints to test
 * @param testFn Function to execute for each breakpoint
 */
export const testAllBreakpoints = (
  testName: string,
  breakpoints: Breakpoint[],
  testFn: (breakpoint: Breakpoint) => void
): void => {
  describe(testName, () => {
    breakpoints.forEach(breakpoint => {
      it(`at ${breakpoint} breakpoint`, () => {
        testFn(breakpoint);
      });
    });
  });
};

/**
 * Create responsive visual tests for a component
 * 
 * @param componentName Name of the component being tested
 * @param renderFn Function that renders the component at a given breakpoint
 * @param breakpoints Array of breakpoints to test (defaults to primary breakpoints)
 */
export const createResponsiveVisualTests = (
  componentName: string,
  renderFn: (breakpoint: Breakpoint) => React.ReactElement,
  breakpoints: Breakpoint[] = ['xs', 'md', 'xl']
): void => {
  describe(`${componentName} responsive visual tests`, () => {
    breakpoints.forEach(breakpoint => {
      it(`renders correctly at ${breakpoint} breakpoint`, () => {
        const { width, height } = getViewportForBreakpoint(breakpoint);
        // This would be implemented with actual visual testing library
        // like jest-image-snapshot in a real test environment
        console.log(`Testing ${componentName} at ${width}x${height} (${breakpoint})`);
      });
    });
  });
};
