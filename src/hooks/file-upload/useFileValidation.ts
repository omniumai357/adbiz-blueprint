
import { useState, useCallback } from 'react';
import { FileState } from '@/hooks/useFileUpload';
import { validateFiles } from '@/utils/file-validation';
import { toast } from '@/hooks/ui/use-toast';

// Maximum file sizes in bytes
const MAX_FILE_SIZES = {
  logo: 5 * 1024 * 1024, // 5MB
  images: 10 * 1024 * 1024, // 10MB
  videos: 50 * 1024 * 1024, // 50MB
  documents: 20 * 1024 * 1024 // 20MB
};

export const useFileValidation = () => {
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Format file size for display
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }, []);
  
  // Validate file size
  const validateFileSize = useCallback((file: File, fileType: keyof FileState): boolean => {
    const maxSize = MAX_FILE_SIZES[fileType];
    return file.size <= maxSize;
  }, []);
  
  // Validate file upload
  const validateFileUpload = useCallback(
    (files: File[], fileType: keyof FileState): { validFiles: File[], hasError: boolean } => {
      setValidationError(null);
      
      // First validate file types
      const { validFiles: typeValidFiles, hasInvalidFiles } = validateFiles(files, fileType);
      
      // Then validate file sizes
      const validFiles = typeValidFiles.filter(file => {
        const isValidSize = validateFileSize(file, fileType);
        if (!isValidSize) {
          console.warn(`File size too large: ${file.name} (${formatFileSize(file.size)})`);
        }
        return isValidSize;
      });
      
      const hasSizeErrors = validFiles.length < typeValidFiles.length;
      const hasError = hasInvalidFiles || hasSizeErrors;
      
      // Set appropriate error message
      if (hasError) {
        if (validFiles.length === 0) {
          const errorMessage = hasInvalidFiles 
            ? `Invalid file type. Please use a supported format for ${fileType}.`
            : `File too large. Maximum size for ${fileType} is ${formatFileSize(MAX_FILE_SIZES[fileType])}.`;
          
          setValidationError(errorMessage);
          toast({
            variant: "destructive",
            title: "File validation error",
            description: errorMessage
          });
        } else {
          const errorMessage = hasInvalidFiles 
            ? "Some files have invalid types. Only supported formats were added."
            : `Some files exceed the size limit of ${formatFileSize(MAX_FILE_SIZES[fileType])} and were skipped.`;
          
          setValidationError(errorMessage);
          toast({
            variant: "destructive",
            title: "Some files couldn't be added",
            description: errorMessage
          });
        }
      }
      
      return { 
        validFiles, 
        hasError
      };
    },
    [formatFileSize, validateFileSize]
  );
  
  // Get maximum file size for a file type
  const getMaxFileSize = useCallback((fileType: keyof FileState): number => {
    return MAX_FILE_SIZES[fileType];
  }, []);
  
  return {
    validationError,
    setValidationError,
    validateFileUpload,
    formatFileSize,
    getMaxFileSize
  };
};
