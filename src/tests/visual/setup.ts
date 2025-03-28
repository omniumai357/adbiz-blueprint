
/**
 * Setup file for visual regression tests with Jest
 */

import '@testing-library/jest-dom';
import { configureToMatchImageSnapshot } from './visualRegressionSetup';

// Configure jest-image-snapshot
configureToMatchImageSnapshot();

// Mock window.matchMedia for responsive tests
window.matchMedia = window.matchMedia || function(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: function() {},
    removeListener: function() {},
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

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
  unobserve() {}
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Global timeout for visual tests (may need to be longer for complex components)
jest.setTimeout(30000);
