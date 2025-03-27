
/**
 * Re-export all file-upload related hooks for backward compatibility
 * 
 * This file maintains the old import paths while redirecting to 
 * the new feature-based organization structure.
 */

export * from '@/features/file-upload/hooks/useFileUpload';
export * from '@/features/file-upload/hooks/useFileValidation';
export * from '@/features/file-upload/hooks/useFileUploadHandlers';
export * from '@/features/file-upload/hooks/useFileUploadProgress';
export * from '@/features/file-upload/hooks/useFileValidator';

// Re-export types
export * from '@/features/file-upload/types';
