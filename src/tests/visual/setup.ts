
/**
 * Setup file for visual regression tests with Jest
 */

import '@testing-library/jest-dom';
import { configureToMatchImageSnapshot } from './visualRegressionSetup';

// Configure jest-image-snapshot
configureToMatchImageSnapshot();

// Mock window.matchMedia for responsive tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {},
  };
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
  return 0;
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
};

// Global timeout for visual tests (may need to be longer for complex components)
jest.setTimeout(30000);
