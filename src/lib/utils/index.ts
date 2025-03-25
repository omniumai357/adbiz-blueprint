
/**
 * Utility Functions Index
 * 
 * This file centralizes exports from all utility modules,
 * providing a single import point for utility functions.
 * This improves maintainability by organizing related utilities
 * while keeping imports clean and simple.
 */

// Re-export from each utility file for easy imports
export * from './format-utils';
export * from './validation-utils';
export * from './dom-utils';

// Re-export the cn utility which has been moved here from the parent utils.ts
export function cn(...inputs: any[]) {
  return import('../utils').then(mod => mod.cn(...inputs));
}
