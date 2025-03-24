
import { useState } from 'react';

export const useFileUploadProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, { name: string; progress: number }>>({});
  
  /**
   * Update progress for a specific file
   */
  const updateProgress = (key: string, fileName: string, progress: number) => {
    setUploadProgress(prev => ({
      ...prev,
      [key]: {
        name: fileName,
        progress
      }
    }));
  };

  return { uploadProgress, updateProgress };
};
