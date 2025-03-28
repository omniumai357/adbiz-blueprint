import { useCallback, useState, useEffect } from 'react';
import { FileState, FileItem, UploadProgressItem, FileStatus } from '@/features/file-upload/types';
import { logger } from '@/lib/utils/logging';

/**
 * Main hook for file upload functionality within the application
 */
export function useFileUpload() {
  const [files, setFiles] = useState<Record<string, File | FileItem[]>>({});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = useCallback((fileType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    logger.debug('File change detected', { 
      context: 'FileUpload',
      data: {
        fileType,
        count: fileList.length
      }
    });

    // Handle single file upload (like logo)
    if (fileType === 'logo') {
      setFiles(prev => ({
        ...prev,
        [fileType]: fileList[0]
      }));
      return;
    }

    // Handle multiple file uploads
    const newFiles = Array.from(fileList).map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      status: 'ready' as FileStatus,
      progress: 0,
    }));

    setFiles(prev => {
      const existingFiles = prev[fileType] && Array.isArray(prev[fileType]) 
        ? prev[fileType] as FileItem[] 
        : [];
        
      return {
        ...prev,
        [fileType]: [...existingFiles, ...newFiles]
      };
    });
  }, []);

  const removeFile = useCallback((fileType: string, index?: number) => {
    if (index === undefined) {
      // Remove entire file type
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[fileType];
        return newFiles;
      });
      return;
    }

    // Remove specific file at index
    setFiles(prev => {
      if (!prev[fileType] || !Array.isArray(prev[fileType])) return prev;
      
      const newTypeFiles = [...(prev[fileType] as FileItem[])];
      newTypeFiles.splice(index, 1);
      
      return {
        ...prev,
        [fileType]: newTypeFiles
      };
    });
  }, []);

  const uploadFiles = useCallback(async (businessId: string) => {
    logger.info('Starting file upload process', { 
      context: 'FileUpload',
      data: { businessId }
    });
    
    setUploading(true);
    setErrors([]);
    
    try {
      // Mock implementation - replace with actual upload logic
      await new Promise(r => setTimeout(r, 1000));
      
      logger.info('Files uploaded successfully', { 
        context: 'FileUpload',
        data: { businessId }
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      
      logger.error('File upload failed', { 
        context: 'FileUpload',
        data: { businessId, error: errorMessage }
      });
      
      setErrors(prev => [...prev, errorMessage]);
      return false;
    } finally {
      setUploading(false);
    }
  }, []);

  const resetFiles = useCallback(() => {
    setFiles({});
    setProgress({});
    setErrors([]);
  }, []);

  return {
    files,
    uploading,
    progress,
    errors,
    handleFileChange,
    removeFile,
    uploadFiles,
    resetFiles,
    hasErrors: errors.length > 0
  };
}
