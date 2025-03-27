
/**
 * File Upload Components Module
 * 
 * This file exports all file upload related components from a centralized location,
 * improving discoverability and preventing import duplication.
 */

// Core components
export { default as FileItem } from './FileItem';
export { default as FilePreviewGrid } from './FilePreviewGrid';
export { default as FileUploadCategory } from './FileUploadCategory';

// UI components
export { FileUploadField } from './FileUploadField';
export { FilePreview } from './FilePreview';

/**
 * Available file upload components:
 * 
 * - FileItem: Individual file display with preview and removal options
 * - FilePreviewGrid: Grid display of multiple uploaded files
 * - FileUploadCategory: Category-based file upload with validation
 * - FileUploadField: Input field for file uploads with drag & drop
 * - FilePreview: Preview of selected files with progress
 */
