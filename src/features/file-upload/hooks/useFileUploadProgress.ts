
import { useState, useCallback } from 'react';
import { UploadProgressItem } from '../types';

/**
 * Hook for managing file upload progress
 * 
 * Tracks and updates progress for multiple file uploads
 * 
 * @returns Object with progress state and helper functions
 */
export const useFileUploadProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressItem>>({});

  const updateProgress = useCallback((key: string, name: string, progress: number) => {
    setUploadProgress(prev => ({
      ...prev,
      [key]: { name, progress }
    }));
  }, []);

  const resetProgress = useCallback((key?: string) => {
    if (key) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[key];
        return newProgress;
      });
    } else {
      setUploadProgress({});
    }
  }, []);

  const completeProgress = useCallback((key: string) => {
    setUploadProgress(prev => {
      if (prev[key]) {
        return {
          ...prev,
          [key]: { ...prev[key], progress: 100 }
        };
      }
      return prev;
    });
  }, []);

  return {
    uploadProgress,
    updateProgress,
    resetProgress,
    completeProgress
  };
};
