
import { useCallback } from 'react';
import { logger } from '@/utils/logger';

interface ValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Hook for validating files before upload
 */
export const useFileValidator = () => {
  /**
   * Format file size for display
   */
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }, []);

  /**
   * Get validation options based on file type
   */
  const getValidationOptions = useCallback((fileType: string): ValidationOptions => {
    // Default validation options by file type
    const options: Record<string, ValidationOptions> = {
      logo: {
        maxSizeBytes: 5 * 1024 * 1024, // 5 MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml']
      },
      images: {
        maxSizeBytes: 10 * 1024 * 1024, // 10 MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      },
      videos: {
        maxSizeBytes: 50 * 1024 * 1024, // 50 MB
        allowedTypes: ['video/mp4', 'video/quicktime', 'video/webm']
      },
      documents: {
        maxSizeBytes: 15 * 1024 * 1024, // 15 MB
        allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      },
      // Default options for any other file type
      default: {
        maxSizeBytes: 5 * 1024 * 1024, // 5 MB
        allowedTypes: []
      }
    };

    return options[fileType] || options.default;
  }, []);

  /**
   * Validate a single file
   */
  const validateFile = useCallback((file: File, fileType: string): ValidationResult => {
    const options = getValidationOptions(fileType);
    
    // Check file size
    if (options.maxSizeBytes && file.size > options.maxSizeBytes) {
      const errorMessage = `File "${file.name}" exceeds maximum size of ${formatFileSize(options.maxSizeBytes)}`;
      logger.warn(errorMessage, {
        fileSize: formatFileSize(file.size),
        maxSize: formatFileSize(options.maxSizeBytes)
      });
      
      return {
        isValid: false,
        errorMessage
      };
    }
    
    // Check file type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const isValidType = options.allowedTypes.includes(file.type);
      
      if (!isValidType) {
        const errorMessage = `File "${file.name}" has invalid type. Allowed types: ${options.allowedTypes.join(', ')}`;
        logger.warn(errorMessage, {
          actualType: file.type,
          allowedTypes: options.allowedTypes.join(', ')
        });
        
        return {
          isValid: false,
          errorMessage
        };
      }
    }
    
    return { isValid: true };
  }, [getValidationOptions, formatFileSize]);

  /**
   * Validate multiple files
   */
  const validateFiles = useCallback((files: File[], fileType: string): { 
    validFiles: File[];
    invalidFiles: File[];
    errors: string[];
  } => {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];
    const errors: string[] = [];
    
    files.forEach(file => {
      const result = validateFile(file, fileType);
      
      if (result.isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
        if (result.errorMessage) {
          errors.push(result.errorMessage);
        }
      }
    });
    
    return { validFiles, invalidFiles, errors };
  }, [validateFile]);

  return {
    formatFileSize,
    validateFile,
    validateFiles,
    getValidationOptions
  };
};
