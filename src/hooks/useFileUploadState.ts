
import { useState } from 'react';

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
 * @returns Object with file state and setter function
 */
export const useFileUploadState = () => {
  const [files, setFiles] = useState<FileState>({
    logo: null,
    images: [],
    videos: [],
    documents: []
  });

  return {
    files,
    setFiles
  };
};
