
import { useState, useCallback } from 'react';
import { FileState, FileItem } from '../types';

/**
 * Hook for managing file upload state
 */
export const useFileUploadState = () => {
  // Fix the initial state to match the FileState interface
  const [files, setFiles] = useState<FileState>({
    identity: [],
    business: [],
    additional: [],
    logo: null,
    images: [],
    videos: [],
    documents: []
  });

  const updateFiles = useCallback((newFiles: Partial<FileState>) => {
    setFiles(prev => ({
      ...prev,
      ...newFiles
    }));
  }, []);

  const addFile = useCallback((type: keyof FileState, file: File) => {
    setFiles(prev => {
      if (type === 'logo') {
        return { ...prev, [type]: file };
      } else {
        // Create a proper FileItem for array types
        const newFileItem: FileItem = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          progress: 0
        };
        
        return { 
          ...prev, 
          [type]: [...(prev[type] as FileItem[]), newFileItem] 
        };
      }
    });
  }, []);

  const removeFile = useCallback((type: keyof FileState, index?: number) => {
    setFiles(prev => {
      if (type === 'logo') {
        return { ...prev, [type]: null };
      } else if (index !== undefined) {
        const newFiles = [...(prev[type] as FileItem[])];
        newFiles.splice(index, 1);
        return { ...prev, [type]: newFiles };
      }
      return prev;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles({
      identity: [],
      business: [],
      additional: [],
      logo: null,
      images: [],
      videos: [],
      documents: []
    });
  }, []);

  return {
    files,
    setFiles,
    updateFiles,
    addFile,
    removeFile,
    clearFiles
  };
};
