
import { useState } from 'react';
import { FileState } from '@/hooks/useFileUpload';
import { validateFiles } from '@/utils/file-validation';

export const useFileValidation = () => {
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const validateFileUpload = (
    files: File[], 
    fileType: keyof FileState
  ): { validFiles: File[], hasError: boolean } => {
    setValidationError(null);
    
    const { validFiles, hasInvalidFiles } = validateFiles(files, fileType);
    
    if (hasInvalidFiles) {
      if (validFiles.length === 0) {
        setValidationError(`Invalid file type. Please use a supported format for ${fileType}.`);
      } else {
        setValidationError(`Some files have invalid types. Only supported formats were added.`);
      }
    }
    
    return { 
      validFiles, 
      hasError: hasInvalidFiles 
    };
  };
  
  return {
    validationError,
    setValidationError,
    validateFileUpload
  };
};
