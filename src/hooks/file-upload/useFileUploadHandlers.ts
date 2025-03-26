import { useState } from 'react';
import { FileState } from './useFileUpload';
import { validateFiles } from '@/utils/file-validation';

export interface UseFileUploadHandlersProps {
  files: FileState;
  setFiles: React.Dispatch<React.SetStateAction<FileState>>;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
  validateFiles?: typeof validateFiles;
}

export interface UseFileUploadHandlersResult {
  handleFileChange: (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
}

const useFileUploadHandlers = (props: UseFileUploadHandlersProps): UseFileUploadHandlersResult => {
  const { files, setFiles, setUploadError } = props;
  const fileValidator = props.validateFiles || validateFiles;

  const handleFileChange = (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => {
    let newFiles: File[] = [];
    
    // Handle event input
    if ('target' in e && e.target.files) {
      newFiles = Array.from(e.target.files);
    } 
    // Handle direct array of files
    else if (Array.isArray(e)) {
      newFiles = Array.from(e);
    }
    
    if (newFiles.length === 0) return;

    // For logo, we only keep one file
    if (fileType === 'logo') {
      const { validFiles, hasInvalidFiles } = fileValidator([newFiles[0]], fileType);
      
      if (hasInvalidFiles) {
        setUploadError(`Invalid file type. Please use a supported format.`);
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [fileType]: validFiles[0]
      }));
      return;
    }
    
    // For other file types, we append to existing files
    const { validFiles, hasInvalidFiles } = fileValidator(newFiles, fileType);
    
    if (hasInvalidFiles) {
      setUploadError(`Some files have invalid types. Only supported formats were added.`);
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => ({
        ...prev,
        [fileType]: [...prev[fileType], ...validFiles]
      }));
    }
  };

  const onRemoveFile = (fileType: keyof FileState, index?: number) => {
    if (fileType === 'logo') {
      setFiles(prev => ({
        ...prev,
        logo: null
      }));
      return;
    }
    
    if (index !== undefined) {
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

export default useFileUploadHandlers;
