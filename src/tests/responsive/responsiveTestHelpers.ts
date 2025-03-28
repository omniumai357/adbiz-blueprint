
import { Breakpoint } from '@/hooks/useResponsive';

/**
 * Standard viewport sizes for testing responsive components
 */
export const TEST_VIEWPORTS = {
  xs: { width: 320, height: 568 },   // Small mobile
  sm: { width: 576, height: 768 },   // Mobile
  md: { width: 768, height: 1024 },  // Tablet
  lg: { width: 1024, height: 768 },  // Landscape tablet / small laptop
  xl: { width: 1280, height: 800 },  // Desktop
  xxl: { width: 1920, height: 1080 } // Large desktop
};

/**
 * Maps a breakpoint name to viewport dimensions
 */
export function getViewportForBreakpoint(breakpoint: Breakpoint): { width: number, height: number } {
  return TEST_VIEWPORTS[breakpoint] || TEST_VIEWPORTS.md;
}

/**
 * Simulates a window resize to the specified dimensions
 * 
 * @param width - Viewport width in pixels
 * @param height - Viewport height in pixels
 * @returns Cleanup function that resets the original dimensions
 */
export function mockWindowSize(width: number, height: number): () => void {
  // Store original dimensions
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;
  
  // Mock window.innerWidth and window.innerHeight
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
  
  // Mock matchMedia for orientation
  const originalMatchMedia = window.matchMedia;
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('orientation: landscape') ? width > height : width <= height,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    })
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
  
  // Return cleanup function
  return () => {
    Object.defineProperty(window, 'innerWidth', { 
      writable: true, 
      configurable: true, 
      value: originalWidth 
    });
    
    Object.defineProperty(window, 'innerHeight', { 
      writable: true, 
      configurable: true, 
      value: originalHeight
    });
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: originalMatchMedia
    });
    
    window.dispatchEvent(new Event('resize'));
  };
}

/**
 * Test helper for running tests at multiple breakpoints
 * 
 * @param testName - The name of the test
 * @param breakpoints - The breakpoints to test at
 * @param testFn - The test function to run for each breakpoint
 */
export function testAllBreakpoints(
  testName: string,
  breakpoints: Breakpoint[],
  testFn: (breakpoint: Breakpoint) => void
): void {
  describe(testName, () => {
    breakpoints.forEach(breakpoint => {
      it(`at ${breakpoint} breakpoint`, () => {
        const viewport = getViewportForBreakpoint(breakpoint);
        const cleanup = mockWindowSize(viewport.width, viewport.height);
        
        try {
          testFn(breakpoint);
        } finally {
          cleanup();
        }
      });
    });
  });
}

/**
 * Creates a formatted snapshot identifier for visual tests
 * 
 * @param componentName - Name of the component being tested
 * @param breakpoint - Breakpoint being tested
 * @param variant - Optional variant name
 * @returns Formatted snapshot name
 */
export function getSnapshotName(
  componentName: string, 
  breakpoint: Breakpoint, 
  variant?: string
): string {
  return `${componentName}-${breakpoint}${variant ? '-' + variant : ''}`;
}
