
import { useCallback, useState, useEffect } from 'react';
import { FileState, FileItem, UploadProgressItem, FileUploadHook } from '../types';
import { useFileUploadProgress } from './useFileUploadProgress';
import { useFileUploadState } from './useFileUploadState';
import { fileAdapter } from '@/utils/file-adapter';
import { logger } from '@/utils/logger';

/**
 * Main hook for file upload functionality
 * 
 * This hook combines state management and file upload handling in one place
 */
export const useFileUpload = (): FileUploadHook => {
  // Use the specialized hooks internally
  const {
    files,
    updateFiles,
    addFile,
    removeFile,
    clearFiles
  } = useFileUploadState();
  
  const {
    uploadProgress,
    updateProgress,
    resetProgress
  } = useFileUploadProgress();
  
  // Local state
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Reset selected files when files state changes
  useEffect(() => {
    setSelectedFiles([]);
  }, [files]);
  
  // Handle file changes from input or drop events
  const handleFileChange = useCallback((fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => {
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

    logger.info('File change detected', { 
      fileType, 
      fileCount: newFiles.length,
      fileTypes: newFiles.map(f => f.type).join(', ')
    });

    // Convert fileType to string explicitly
    const fileTypeStr = fileAdapter.fileTypeToString(fileType);

    // For logo, we only keep one file
    if (fileType === 'logo') {
      updateFiles({
        [fileType]: newFiles[0]
      });
      return;
    }
    
    // For array types, convert Files to FileItems
    const newFileItems = newFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      progress: 0
    }));
    
    // Add to existing files
    updateFiles({
      [fileType]: [...(files[fileType] as FileItem[] || []), ...newFileItems]
    });
  }, [files, updateFiles]);
  
  // Remove a file from state
  const onRemoveFile = useCallback((fileType: keyof FileState, index?: number) => {
    if (fileType === 'logo') {
      logger.debug('Removing logo file');
      removeFile(fileType);
      return;
    }
    
    if (index !== undefined) {
      const currentFiles = files[fileType] as FileItem[];
      if (Array.isArray(currentFiles) && currentFiles[index]) {
        const fileToRemove = currentFiles[index];
        
        logger.debug('Removing file', { 
          fileType, 
          index, 
          fileName: fileToRemove?.file?.name 
        });
        
        // Remove from progress tracking if needed
        if (fileToRemove && fileToRemove.id) {
          resetProgress(fileToRemove.id);
        }
        
        // Remove the file at the specified index
        removeFile(fileType, index);
      }
    }
  }, [files, removeFile, resetProgress]);
  
  // Upload all files to storage
  const uploadFiles = useCallback(async (businessId: string): Promise<boolean> => {
    setUploading(true);
    setUploadError(null);
    logger.info('Starting file upload process', { businessId });
    
    try {
      // For now, just simulate an upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      logger.info('Upload completed successfully', { businessId });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      logger.error('File upload failed', { 
        businessId, 
        error: errorMessage 
      });
      setUploadError('Failed to upload files');
      return false;
    } finally {
      setUploading(false);
    }
  }, []);
  
  // Reset all file upload state
  const resetFileUpload = useCallback(() => {
    logger.debug('Resetting file upload state');
    clearFiles();
    resetProgress();
    setUploadError(null);
    setSelectedFiles([]);
  }, [clearFiles, resetProgress]);
  
  // Upload a single file (for direct uploads)
  const uploadFile = useCallback(async (file: File, path: string): Promise<string> => {
    logger.debug('Uploading single file', { fileName: file.name, path });
    
    try {
      // Simulate upload with delay based on file size
      const delay = Math.min(Math.floor(file.size / 10000), 2000) + 500;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Return a simulated URL
      const url = `https://example.com/uploads/${path}/${file.name}`;
      logger.debug('Single file upload complete', { url });
      return url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      logger.error('Single file upload failed', { 
        fileName: file.name, 
        error: errorMessage 
      });
      throw error;
    }
  }, []);
  
  return {
    files,
    uploadProgress,
    uploadError,
    uploading,
    handleFileChange,
    onRemoveFile,
    uploadFiles,
    resetFileUpload,
    setUploadError,
    selectedFiles,
    setSelectedFiles,
    uploadFile,
    hasError: !!uploadError,
    isUploading: uploading
  };
};
