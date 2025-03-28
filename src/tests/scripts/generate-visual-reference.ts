
/**
 * Visual Reference Library Generator
 * 
 * This script automates the process of capturing screenshots of all components
 * at different breakpoints to create a comprehensive visual reference library.
 * 
 * This file is now just a wrapper that imports the functionality from modularized files.
 */

import { generateVisualReferenceLibrary } from './visual-reference/generator';

// Run the generator
generateVisualReferenceLibrary()
  .catch(error => {
    console.error('Failed to generate Visual Reference Library');
    console.error(error);
    process.exit(1);
  });
