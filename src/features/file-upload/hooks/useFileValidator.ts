
import { useState, useCallback } from 'react';
import { getAllowedFileTypes, getReadableFileFormats, formatFileSize } from '@/utils/file-validation';
import { FileState } from '../types';

/**
 * Hook for validating files against type and size constraints
 */
export const useFileValidator = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  
  /**
   * Check if a file type is valid for the given category
   */
  const isFileTypeValid = useCallback((file: File, fileCategory: keyof FileState): boolean => {
    const allowedTypes = getAllowedFileTypes(fileCategory);
    return allowedTypes.length === 0 || allowedTypes.includes(file.type);
  }, []);
  
  /**
   * Check if a file size is valid for the given category
   */
  const isFileSizeValid = useCallback((file: File, maxSizeBytes: number): boolean => {
    return file.size <= maxSizeBytes;
  }, []);
  
  /**
   * Validate a batch of files against type and size constraints
   */
  const validateFiles = useCallback((
    files: File[],
    fileCategory: keyof FileState,
    maxSizeBytes: number
  ): { validFiles: File[]; invalidFiles: { file: File; reason: string }[] } => {
    const validFiles: File[] = [];
    const invalidFiles: { file: File; reason: string }[] = [];
    const errors: string[] = [];
    
    files.forEach(file => {
      if (!isFileTypeValid(file, fileCategory)) {
        invalidFiles.push({ 
          file, 
          reason: `Invalid file type. Accepted formats: ${getReadableFileFormats(fileCategory)}` 
        });
        errors.push(`"${file.name}" has an invalid file type`);
      } else if (!isFileSizeValid(file, maxSizeBytes)) {
        invalidFiles.push({ 
          file, 
          reason: `File size exceeds limit of ${formatFileSize(maxSizeBytes)}` 
        });
        errors.push(`"${file.name}" exceeds the maximum file size of ${formatFileSize(maxSizeBytes)}`);
      } else {
        validFiles.push(file);
      }
    });
    
    if (errors.length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        [fileCategory as string]: errors
      }));
    }
    
    return { validFiles, invalidFiles };
  }, [isFileTypeValid, isFileSizeValid]);
  
  /**
   * Clear validation errors for a specific category or all categories
   */
  const clearValidationErrors = useCallback((fileCategory?: string) => {
    if (fileCategory) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fileCategory];
        return newErrors;
      });
    } else {
      setValidationErrors({});
    }
  }, []);
  
  return {
    validationErrors,
    isFileTypeValid,
    isFileSizeValid,
    validateFiles,
    clearValidationErrors
  };
};
