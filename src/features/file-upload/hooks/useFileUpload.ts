
import { useState, useCallback } from 'react';
import { FileState, UploadProgressItem, FileItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Initialize empty file state
const initialFileState: FileState = {
  identity: [],
  business: [],
  additional: [],
  logo: null,
  images: [],
  videos: [],
  documents: []
};

/**
 * Hook for managing file uploads, providing state and methods for file selection,
 * removal, progress tracking, and upload to storage
 */
export const useFileUpload = () => {
  const [files, setFiles] = useState<FileState>(initialFileState);
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressItem>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = useCallback((fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => {
    setUploadError(null);
    
    let selectedFiles: File[] = [];
    
    if (Array.isArray(e)) {
      // Handle case when e is an array of files (e.g., from drag and drop)
      selectedFiles = [...e];
    } else if ('target' in e && e.target.files) {
      // Handle case when e is an event from file input
      selectedFiles = Array.from(e.target.files);
    }
    
    if (selectedFiles.length === 0) {
      logger.debug(`No files selected for ${String(fileType)}`);
      return;
    }
    
    logger.debug(`Files selected for ${String(fileType)}:`, selectedFiles.length);
    
    // Special handling for logo (single file)
    if (fileType === 'logo') {
      setFiles(prev => ({
        ...prev,
        logo: selectedFiles[0]
      }));
      return;
    }
    
    // Create file items with unique IDs for arrays
    const newFiles = selectedFiles.map(file => ({
      id: uuidv4(),
      file,
      progress: 0
    }));
    
    // Update file state
    setFiles(prev => {
      // Ensure we're working with an array
      const existingFiles = Array.isArray(prev[fileType]) ? prev[fileType] as FileItem[] : [];
      
      return {
        ...prev,
        [fileType]: [...existingFiles, ...newFiles]
      };
    });
  }, []);

  // Remove a file
  const onRemoveFile = useCallback((fileType: keyof FileState, index?: number) => {
    logger.debug(`Removing file from ${String(fileType)}`, { index });
    
    // Handle logo (single file)
    if (fileType === 'logo') {
      setFiles(prev => ({
        ...prev,
        logo: null
      }));
      return;
    }
    
    // Handle arrays of files
    if (Array.isArray(files[fileType])) {
      if (index === undefined) {
        // Remove all files of the given type if no index is provided
        setFiles(prev => ({
          ...prev,
          [fileType]: []
        }));
      } else {
        // Remove only the file at the given index
        setFiles(prev => {
          const fileArray = prev[fileType] as FileItem[];
          return {
            ...prev,
            [fileType]: fileArray.filter((_, i) => i !== index)
          };
        });
      }
    }
  }, [files]);

  // Update progress for a specific file
  const updateProgress = useCallback((key: string, name: string, progress: number) => {
    setUploadProgress(prev => ({
      ...prev,
      [key]: { fileName: name, progress }
    }));
  }, []);

  // Reset progress for a specific file or all files
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

  // Reset the entire file upload state
  const resetFileUpload = useCallback(() => {
    logger.debug('Resetting file upload state');
    setFiles(initialFileState);
    setUploadProgress({});
    setUploadError(null);
    setUploading(false);
  }, []);

  // Upload files to Supabase storage
  const uploadFiles = useCallback(async (businessId: string): Promise<boolean> => {
    if (!businessId) {
      const error = 'Business ID is required for file upload';
      logger.error(error);
      setUploadError(error);
      return false;
    }
    
    setUploading(true);
    setUploadError(null);
    
    try {
      logger.info(`Starting file upload for business: ${businessId}`);
      
      // Upload logo if it exists
      if (files.logo) {
        const fileExt = files.logo.name.split('.').pop();
        const filePath = `${businessId}/logo.${fileExt}`;
        
        logger.debug(`Uploading logo: ${filePath}`);
        
        const { error: logoError } = await supabase.storage
          .from('business-docs')
          .upload(filePath, files.logo, {
            upsert: true
          });
          
        if (logoError) {
          throw new Error(`Error uploading logo: ${logoError.message}`);
        }
        
        logger.debug('Logo upload completed successfully');
      }
      
      // Upload other file types (images, videos, documents)
      const fileTypes = ['images', 'videos', 'documents'] as const;
      
      for (const fileType of fileTypes) {
        const fileItems = files[fileType] as FileItem[];
        
        if (Array.isArray(fileItems) && fileItems.length > 0) {
          logger.debug(`Uploading ${fileItems.length} ${fileType}`);
          
          for (const fileItem of fileItems) {
            const fileExt = fileItem.file.name.split('.').pop();
            const filePath = `${businessId}/${fileType}/${fileItem.id}.${fileExt}`;
            
            // Update progress callback
            const progressCallback = (progress: number) => {
              updateProgress(fileItem.id, fileItem.file.name, progress);
            };
            
            logger.debug(`Uploading ${fileType} item: ${filePath}`);
            
            // Upload to Supabase storage - removing onUploadProgress which isn't supported in this version
            const { error } = await supabase.storage
              .from('business-docs')
              .upload(filePath, fileItem.file, {
                upsert: true
              });
              
            if (error) {
              throw new Error(`Error uploading ${fileItem.file.name}: ${error.message}`);
            }
            
            // Manually set progress to 100% since we don't have onUploadProgress
            progressCallback(100);
            
            logger.debug(`${fileType} item upload completed: ${fileItem.file.name}`);
          }
        }
      }
      
      logger.info(`File upload completed successfully for business: ${businessId}`);
      setUploading(false);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during upload';
      logger.error('File upload error:', error);
      setUploadError(errorMessage);
      setUploading(false);
      return false;
    }
  }, [files, updateProgress]);

  return {
    files,
    uploadProgress,
    uploadError,
    uploading,
    handleFileChange,
    onRemoveFile,
    updateProgress,
    resetProgress,
    resetFileUpload,
    uploadFiles
  };
};
