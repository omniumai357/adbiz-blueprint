
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
export function mockWindowSize(width: number, height: number = 800): () => void {
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
    Object.defineProperty(window, 'innerWidth', { value: originalWidth, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalHeight, writable: true });
    Object.defineProperty(window, 'matchMedia', { value: originalMatchMedia });
    window.dispatchEvent(new Event('resize'));
  };
}

/**
 * Helper to test a component at multiple breakpoints
 * 
 * @param description - Test description
 * @param breakpoints - Array of breakpoint names to test
 * @param testFn - Test function that receives the current breakpoint
 */
export function testAllBreakpoints(
  description: string,
  breakpoints: Breakpoint[],
  testFn: (breakpoint: Breakpoint) => void
): void {
  describe(description, () => {
    for (const breakpoint of breakpoints) {
      it(`at ${breakpoint} breakpoint`, () => {
        const { width, height } = getViewportForBreakpoint(breakpoint);
        const cleanup = mockWindowSize(width, height);
        
        try {
          testFn(breakpoint);
        } finally {
          cleanup();
        }
      });
    }
  });
}

/**
 * Wait for any animations to complete before taking screenshots
 */
export function waitForAnimations(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
