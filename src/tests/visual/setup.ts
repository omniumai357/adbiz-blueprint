
/**
 * Setup file for visual regression tests with Jest
 */

import '@testing-library/jest-dom';
import { configureToMatchImageSnapshot } from './visualRegressionSetup';

// Configure jest-image-snapshot
configureToMatchImageSnapshot();

// Mock window.matchMedia for responsive tests with proper TypeScript interfaces
window.matchMedia = window.matchMedia || function(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: function(listener) {
      // Deprecated but kept for backwards compatibility
      this.addEventListener('change', listener);
    },
    removeListener: function(listener) {
      // Deprecated but kept for backwards compatibility
      this.removeEventListener('change', listener);
    },
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() { return true; },
  } as MediaQueryList;
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
  return 0;
};

// Mock IntersectionObserver with proper implementation
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  
  constructor(private callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  
  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
  unobserve(): void {}
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Global timeout for visual tests (may need to be longer for complex components)
jest.setTimeout(30000);
