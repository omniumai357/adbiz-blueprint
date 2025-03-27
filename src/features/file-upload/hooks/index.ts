
/**
 * File Upload Hooks Module
 * 
 * This file exports all file upload related hooks from a centralized location,
 * improving discoverability and preventing import duplication.
 */

// Core file upload hooks
export { useFileUpload } from './useFileUpload';
export { useFileValidation } from './useFileValidation';
export { useFileUploadProgress } from './useFileUploadProgress';

// File adapter hooks
export { useFileUploadHandlers } from './useFileUploadHandlers';
export { useFileValidator } from './useFileValidator';

/**
 * Available file upload hooks:
 * 
 * - useFileUpload: Main hook for managing file uploads, selection, and state
 * - useFileValidation: Validation utilities for file uploads
 * - useFileUploadProgress: Track and manage file upload progress
 * - useFileUploadHandlers: Event handlers for file upload components
 * - useFileValidator: Validate files against type and size constraints
 */
