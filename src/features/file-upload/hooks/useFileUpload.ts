
import { useState, useCallback } from 'react';
import { FileState, UploadProgressItem, FileItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

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
    
    if (selectedFiles.length === 0) return;
    
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
    setFiles(prev => ({
      ...prev,
      [fileType]: [...(Array.isArray(prev[fileType]) ? prev[fileType] : []), ...newFiles]
    }));
  }, []);

  // Remove a file
  const onRemoveFile = useCallback((fileType: keyof FileState, index?: number) => {
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
        setFiles(prev => ({
          ...prev,
          [fileType]: Array.isArray(prev[fileType]) 
            ? (prev[fileType] as FileItem[]).filter((_, i) => i !== index)
            : prev[fileType]
        }));
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
    setFiles(initialFileState);
    setUploadProgress({});
    setUploadError(null);
    setUploading(false);
  }, []);

  // Upload files to Supabase storage
  const uploadFiles = useCallback(async (businessId: string): Promise<boolean> => {
    if (!businessId) {
      setUploadError('Business ID is required for file upload');
      return false;
    }
    
    setUploading(true);
    setUploadError(null);
    
    try {
      // Upload logo if it exists
      if (files.logo) {
        const fileExt = files.logo.name.split('.').pop();
        const filePath = `${businessId}/logo.${fileExt}`;
        
        const { error: logoError } = await supabase.storage
          .from('business-docs')
          .upload(filePath, files.logo, {
            upsert: true
          });
          
        if (logoError) {
          throw new Error(`Error uploading logo: ${logoError.message}`);
        }
      }
      
      // Upload other file types (images, videos, documents)
      const fileTypes = ['images', 'videos', 'documents'] as const;
      
      for (const fileType of fileTypes) {
        if (Array.isArray(files[fileType]) && files[fileType].length > 0) {
          for (const file of files[fileType] as FileItem[]) {
            const fileExt = file.file.name.split('.').pop();
            const filePath = `${businessId}/${fileType}/${file.id}.${fileExt}`;
            
            // Update progress callback
            const progressCallback = (progress: number) => {
              updateProgress(file.id, file.file.name, progress);
            };
            
            // Upload to Supabase storage - removing onUploadProgress which isn't supported in this version
            const { error } = await supabase.storage
              .from('business-docs')
              .upload(filePath, file.file, {
                upsert: true
              });
              
            if (error) {
              throw new Error(`Error uploading ${file.file.name}: ${error.message}`);
            }
            
            // Manually set progress to 100% since we don't have onUploadProgress
            progressCallback(100);
          }
        }
      }
      
      setUploading(false);
      return true;
    } catch (error) {
      console.error('File upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'An unknown error occurred during upload');
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
