
/**
 * File Upload Feature Module
 * 
 * This module provides a complete file upload system with hooks, components,
 * types, and utilities for handling file uploads across the application.
 */

// Export types directly to avoid ambiguity
export type { FileState, FileItem, UploadProgressItem, FileUploadHook, UploadResult } from './types';

// Core file upload functionality
export * from './hooks';

// Components and UI elements
export * from './components';

// Utilities
export * from './utils';
