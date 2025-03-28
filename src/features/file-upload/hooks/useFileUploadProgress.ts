
import { useState, useCallback } from 'react';
import { UploadProgressItem, FileStatus } from '../types';
import { logger } from '@/utils/logger';

/**
 * Hook for tracking and managing file upload progress
 */
export const useFileUploadProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressItem>>({});

  /**
   * Update progress for a specific file
   */
  const updateProgress = useCallback((fileId: string, fileName: string, progress: number, fileType: string = 'file', status: FileStatus = 'uploading') => {
    logger.debug(`Updating progress for ${fileName}: ${progress}%`);
    
    setUploadProgress(prev => ({
      ...prev,
      [fileId]: { 
        fileId, 
        fileName, 
        progress, 
        fileType, 
        status 
      }
    }));
  }, []);

  /**
   * Reset progress for a specific file or all files
   */
  const resetProgress = useCallback((fileId?: string) => {
    if (fileId) {
      logger.debug(`Resetting progress for file ID: ${fileId}`);
      
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    } else {
      logger.debug('Resetting all progress');
      setUploadProgress({});
    }
  }, []);

  /**
   * Mark a file upload as complete
   */
  const completeProgress = useCallback((fileId: string) => {
    logger.debug(`Marking file ID ${fileId} as complete`);
    
    setUploadProgress(prev => {
      if (prev[fileId]) {
        return {
          ...prev,
          [fileId]: { ...prev[fileId], progress: 100, status: 'uploaded' as FileStatus }
        };
      }
      return prev;
    });
  }, []);

  /**
   * Calculate overall progress across all files
   */
  const calculateOverallProgress = useCallback((): number => {
    const progressEntries = Object.values(uploadProgress);
    
    if (progressEntries.length === 0) {
      return 0;
    }
    
    const totalProgress = progressEntries.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(totalProgress / progressEntries.length);
  }, [uploadProgress]);

  return {
    uploadProgress,
    updateProgress,
    resetProgress,
    completeProgress,
    calculateOverallProgress,
    isComplete: calculateOverallProgress() === 100
  };
};
