
import { useState } from 'react';

/**
 * Hook for managing file upload progress
 * 
 * Tracks and updates progress for multiple file uploads
 * 
 * @returns Object with progress state and update function
 */
export const useFileUploadProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, { name: string; progress: number }>>({});

  const updateProgress = (key: string, name: string, progress: number) => {
    setUploadProgress(prev => ({
      ...prev,
      [key]: { name, progress }
    }));
  };

  return {
    uploadProgress,
    updateProgress
  };
};
