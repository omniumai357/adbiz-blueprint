
import { useState, useCallback } from 'react';
import { FileState } from '@/features/file-upload/types';
import { logger } from '@/utils/logger';

/**
 * Hook for validating file uploads
 */
export const useFileValidation = () => {
  // Format file size for display (e.g., "2.5 MB")
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }, []);

  // Get the maximum allowed file size for a given file type
  const getMaxFileSize = useCallback((fileType: string): number => {
    const maxSizes: Record<string, number> = {
      logo: 5 * 1024 * 1024, // 5 MB
      images: 10 * 1024 * 1024, // 10 MB
      videos: 50 * 1024 * 1024, // 50 MB
      documents: 15 * 1024 * 1024, // 15 MB
    };

    return maxSizes[fileType] || 5 * 1024 * 1024; // Default to 5 MB if type not specified
  }, []);

  // Validate a file against size and type constraints
  const validateFile = useCallback((file: File, fileType: string): boolean => {
    const maxSize = getMaxFileSize(fileType);
    const allowedTypes: Record<string, string[]> = {
      logo: ['image/jpeg', 'image/png', 'image/svg+xml'],
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      videos: ['video/mp4', 'video/quicktime', 'video/webm'],
      documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    // Check file size
    if (file.size > maxSize) {
      logger.warn(`File "${file.name}" exceeds maximum size for ${fileType}`, {
        data: {
          fileSize: formatFileSize(file.size),
          maxSize: formatFileSize(maxSize)
        }
      });
      return false;
    }

    // Check file type if we have restrictions
    if (allowedTypes[fileType] && allowedTypes[fileType].length > 0) {
      const isValidType = allowedTypes[fileType].includes(file.type);
      if (!isValidType) {
        logger.warn(`File "${file.name}" has invalid type for ${fileType}`, {
          data: {
            actualType: file.type,
            allowedTypes: allowedTypes[fileType].join(', ')
          }
        });
      }
      return isValidType;
    }

    return true;
  }, [getMaxFileSize, formatFileSize]);

  return {
    formatFileSize,
    getMaxFileSize,
    validateFile
  };
};
