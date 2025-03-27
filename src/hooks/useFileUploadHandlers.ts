import { useState } from 'react';
import { FileState, FileItem } from '@/features/file-upload/types';
import { validateFiles } from '@/utils/file-validation';
import { fileAdapter } from '@/utils/file-adapter';

export interface UseFileUploadHandlersProps {
  files: FileState;
  setFiles: React.Dispatch<React.SetStateAction<FileState>>;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
  validateFiles: typeof validateFiles;
}

export interface UseFileUploadHandlersResult {
  handleFileChange: (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
}

const useFileUploadHandlers = (props: UseFileUploadHandlersProps): UseFileUploadHandlersResult => {
  const { files, setFiles, setUploadError } = props;

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

    // Convert fileType to string to satisfy type constraints
    const fileTypeStr = fileAdapter.fileTypeToString(fileType);

    // For logo, we only keep one file
    if (fileType === 'logo') {
      const { validFiles, hasInvalidFiles } = validateFiles([newFiles[0]], fileTypeStr);
      
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
    const { validFiles, hasInvalidFiles } = validateFiles(newFiles, fileTypeStr);
    
    if (hasInvalidFiles) {
      setUploadError(`Some files have invalid types. Only supported formats were added.`);
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => {
        // Create FileItem objects from valid Files
        const newFileItems = fileAdapter.createFileItems(validFiles);
        
        return {
          ...prev,
          [fileType]: [...(prev[fileType] as FileItem[] || []), ...newFileItems]
        };
      });
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
    
    if (index !== undefined && Array.isArray(files[fileType])) {
      setFiles(prev => ({
        ...prev,
        [fileType]: (prev[fileType] as FileItem[]).filter((_, i) => i !== index)
      }));
    }
  };

  return {
    handleFileChange,
    onRemoveFile
  };
};

export default useFileUploadHandlers;
