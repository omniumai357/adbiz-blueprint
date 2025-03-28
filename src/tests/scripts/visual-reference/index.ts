
/**
 * Visual Reference Library Generator - Main Entry Point
 */

import { generateVisualReferenceLibrary } from './generator';

// Run the generator
export const runGenerator = () => {
  generateVisualReferenceLibrary()
    .catch(error => {
      console.error('Failed to generate Visual Reference Library');
      console.error(error);
      process.exit(1);
    });
};

// Re-export for use in other files
export { generateVisualReferenceLibrary };
