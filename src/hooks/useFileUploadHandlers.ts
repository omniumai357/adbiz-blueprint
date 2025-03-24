
import { FileState } from './useFileUpload';
import { Dispatch, SetStateAction, ChangeEvent } from 'react';

interface UseFileUploadHandlersProps {
  files: FileState;
  setFiles: Dispatch<SetStateAction<FileState>>;
  setUploadError: Dispatch<SetStateAction<string | null>>;
  validateFiles: (files: File[], fileType: string) => { validFiles: File[]; hasInvalidFiles: boolean };
}

export const useFileUploadHandlers = ({
  files,
  setFiles,
  setUploadError,
  validateFiles
}: UseFileUploadHandlersProps) => {
  /**
   * Update file state based on type
   */
  const updateFileState = (
    fileType: keyof FileState, 
    validFiles: File[], 
    isLogoType: boolean
  ) => {
    if (isLogoType) {
      setFiles(prev => ({ ...prev, [fileType]: validFiles[0] || null }));
    } else {
      setFiles(prev => ({ ...prev, [fileType]: [...prev[fileType], ...validFiles] }));
    }
  };

  /**
   * Handle file selection
   */
  const handleFileChange = (
    fileType: keyof FileState, 
    e: ChangeEvent<HTMLInputElement> | readonly File[]
  ) => {
    let selectedFiles: File[];
    
    // Check if e is an array of Files or an event using type guard
    if (Array.isArray(e)) {
      // Handle case when e is an array of Files (convert readonly to mutable array)
      selectedFiles = Array.from(e);
    } else {
      // Handle case when e is a ChangeEvent from input
      if (e.target.files) {
        selectedFiles = Array.from(e.target.files);
      } else {
        return;
      }
    }
    
    const { validFiles, hasInvalidFiles } = validateFiles(
      selectedFiles, 
      fileType as string
    );
    
    if (hasInvalidFiles) {
      setUploadError(`Some files were not valid ${fileType} formats and were removed.`);
    } else {
      setUploadError(null);
    }
    
    const isLogoType = fileType === 'logo';
    updateFileState(fileType, validFiles, isLogoType);
  };
  
  /**
   * Remove file from selection
   */
  const onRemoveFile = (fileType: keyof FileState, index?: number) => {
    if (fileType === 'logo') {
      setFiles(prev => ({ ...prev, logo: null }));
    } else if (index !== undefined) {
      setFiles(prev => ({
        ...prev,
        [fileType]: prev[fileType].filter((_, i) => i !== index)
      }));
    }
  };

  return {
    handleFileChange,
    onRemoveFile
  };
};
