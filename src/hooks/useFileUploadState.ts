
import { useState, useCallback } from 'react';

export interface FileState {
  logo: File | null;
  images: File[];
  videos: File[];
  documents: File[];
}

/**
 * Hook for managing file upload state
 * 
 * Provides state and functions for managing uploaded files
 * 
 * @returns Object with file state and helper functions for managing files
 */
export const useFileUploadState = () => {
  const [files, setFiles] = useState<FileState>({
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
        return { 
          ...prev, 
          [type]: [...(prev[type] as File[]), file] 
        };
      }
    });
  }, []);

  const removeFile = useCallback((type: keyof FileState, index?: number) => {
    setFiles(prev => {
      if (type === 'logo') {
        return { ...prev, [type]: null };
      } else if (index !== undefined) {
        const newFiles = [...(prev[type] as File[])];
        newFiles.splice(index, 1);
        return { ...prev, [type]: newFiles };
      }
      return prev;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles({
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
