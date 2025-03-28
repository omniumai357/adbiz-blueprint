
import { FileState, FileItem, FileStatus } from './types';

/**
 * Utility functions for file upload operations
 */

/**
 * Create a FileItem from a File
 */
export const createFileItem = (file: File): FileItem => ({
  id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  file,
  status: 'ready' as FileStatus,
  progress: 0
});

/**
 * Convert a File array to FileItem array
 */
export const createFileItems = (files: File[]): FileItem[] => {
  return files.map(file => createFileItem(file));
};

/**
 * Get a human-readable file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

/**
 * Generate a file path for storage
 */
export const generateFilePath = (businessId: string, fileType: string, file: File): string => {
  const fileExt = file.name.split('.').pop();
  
  if (fileType === 'logo') {
    return `${businessId}/logo.${fileExt}`;
  }
  
  const fileName = `${Date.now()}.${fileExt}`;
  return `${businessId}/${fileType}/${fileName}`;
};

/**
 * Check if a file exceeds the size limit
 */
export const isFileSizeValid = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

/**
 * Get maximum file size for a file type
 */
export const getMaxFileSize = (fileType: string): number => {
  const maxSizes: Record<string, number> = {
    logo: 5 * 1024 * 1024, // 5 MB
    images: 10 * 1024 * 1024, // 10 MB
    videos: 50 * 1024 * 1024, // 50 MB
    documents: 15 * 1024 * 1024, // 15 MB
  };

  return maxSizes[fileType] || 5 * 1024 * 1024; // Default to 5 MB if type not specified
};
