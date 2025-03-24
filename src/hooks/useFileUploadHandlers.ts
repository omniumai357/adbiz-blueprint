
import { FileState } from './useFileUpload';
import { Dispatch, SetStateAction } from 'react';

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
    e: React.ChangeEvent<HTMLInputElement> | File[]
  ) => {
    let selectedFiles: File[];
    
    // Handle both array of Files and event from input
    if (Array.isArray(e)) {
      selectedFiles = e;
    } else if (e.target.files) {
      selectedFiles = Array.from(e.target.files);
    } else {
      return;
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
