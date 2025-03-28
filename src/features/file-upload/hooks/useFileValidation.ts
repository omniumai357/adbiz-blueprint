
import { formatFileSize } from '@/utils/file-validation';
import { FileState } from '../types';

/**
 * Hook for file validation functions
 */
export const useFileValidation = () => {
  const getMaxFileSize = (fileType: keyof FileState): number => {
    // Define maximum file sizes in bytes for each file type
    switch (fileType) {
      case 'logo':
        return 5 * 1024 * 1024; // 5MB for logos
      case 'images':
        return 10 * 1024 * 1024; // 10MB for images
      case 'videos':
        return 100 * 1024 * 1024; // 100MB for videos
      case 'documents':
        return 20 * 1024 * 1024; // 20MB for documents
      default:
        return 10 * 1024 * 1024; // 10MB default
    }
  };

  // Reuse the formatFileSize function from utils
  return {
    getMaxFileSize,
    formatFileSize
  };
};
