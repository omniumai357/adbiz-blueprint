import { useCallback, useState, useEffect } from 'react';
import { FileState, FileItem, UploadProgressItem } from '@/features/file-upload/types';
import { useFileUploadProgress } from '@/features/file-upload/hooks/useFileUploadProgress';
import { useFileUploadState } from '@/features/file-upload/hooks/useFileUploadState';
import { fileAdapter } from '@/utils/file-adapter';
import { logger } from '@/utils/logger';

/**
 * Create a logMessage function that wraps strings in an object for LogData compatibility
 */
function createLogMessageWrapper() {
  return (message: string, additionalData?: Record<string, any>): LogData => {
    return {
      message,
      ...additionalData
    };
  };
}

// In your hooks where string is passed to logger functions, replace with:
// logger.info("Your message", createLogMessageWrapper()("Details", { otherData: value }));

// Or directly use an object instead of a string:
// logger.info("Your message", { data: { details: "Your details" } });

interface LogData {
  message?: string;
  [key: string]: any;
}

/**
 * Main hook for file upload functionality
 * 
 * This hook is maintained for backward compatibility with existing components
 * while leveraging the new feature-based organization internally.
 */
export const useFileUpload = (options = {}) => {
  // Use the feature-based hooks internally
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
  
  // Local state for backward compatibility
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Reset selected files when files state changes (for compatibility)
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
      removeFile(fileType);
      return;
    }
    
    if (index !== undefined) {
      const currentFiles = files[fileType] as FileItem[];
      if (Array.isArray(currentFiles) && currentFiles[index]) {
        const fileToRemove = currentFiles[index];
        
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
    logger.debug('Starting file upload process for business ID:', businessId);
    
    try {
      // For now, just simulate an upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      logger.debug('Upload completed successfully');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      logger.error('File upload failed:', errorMessage);
      setUploadError('Failed to upload files');
      return false;
    } finally {
      setUploading(false);
    }
  }, []);
  
  // Single file upload for backward compatibility
  const uploadFile = useCallback(async (file: File, path: string): Promise<string> => {
    try {
      // Simulate successful upload
      await new Promise(resolve => setTimeout(resolve, 500));
      return `https://example.com/uploads/${path}/${file.name}`;
    } catch (error) {
      logger.error('Single file upload failed:', error);
      throw error;
    }
  }, []);
  
  // Reset all file upload state
  const resetFileUpload = useCallback(() => {
    clearFiles();
    resetProgress();
    setUploadError(null);
    setSelectedFiles([]);
    logger.debug('File upload state reset');
  }, [clearFiles, resetProgress]);
  
  // Convert FileItems to Files for compatibility with components that expect File[]
  const adaptedFiles = fileAdapter.adaptFileStateForUI(files);
  
  return {
    files: adaptedFiles,
    isUploading: uploading,
    hasError: !!uploadError,
    uploadProgress,
    handleFileChange,
    onRemoveFile,
    selectedFiles,
    setSelectedFiles,
    uploadFile,
    uploadFiles,
    uploadError,
    uploading,
    setUploadError,
    resetFileUpload
  };
};

// Re-export types for backward compatibility
export type { FileState, FileItem };
