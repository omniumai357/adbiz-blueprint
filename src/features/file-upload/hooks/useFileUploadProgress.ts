
import { useState, useCallback } from 'react';
import { UploadProgressItem, FileStatus } from '../types';

/**
 * Hook for tracking file upload progress
 */
export const useFileUploadProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressItem>>({});

  const updateProgress = useCallback((fileId: string, progress: number, fileName: string, fileType: string) => {
    setUploadProgress(prev => ({
      ...prev,
      [fileId]: {
        fileId,
        fileName,
        fileType,
        progress,
        status: progress < 100 ? 'uploading' as FileStatus : 'uploaded' as FileStatus
      }
    }));
  }, []);

  const resetProgress = useCallback((fileId: string) => {
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  }, []);

  const clearProgress = useCallback(() => {
    setUploadProgress({});
  }, []);

  return {
    uploadProgress,
    updateProgress,
    resetProgress,
    clearProgress
  };
};
