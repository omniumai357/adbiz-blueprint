
import { useState } from 'react';
import { validateFiles } from '@/utils/file-validation';
import { uploadSingleFile, generateFilePath } from '@/utils/file-upload';

export interface FileState {
  logo: File | null;
  images: File[];
  videos: File[];
  documents: File[];
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileState>({
    logo: null,
    images: [],
    videos: [],
    documents: [],
  });
  const [uploadProgress, setUploadProgress] = useState<Record<string, { name: string; progress: number }>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  /**
   * Update file state based on type
   */
  const updateFileState = (
    fileType: keyof FileState, 
    validFiles: File[], 
    isLogoType: boolean
  ) => {
    if (isLogoType) {
      setFiles(prev => ({ ...prev, [fileType]: validFiles[0] || null }));
    } else {
      setFiles(prev => ({ ...prev, [fileType]: [...prev[fileType], ...validFiles] }));
    }
  };
  
  /**
   * Handle file selection
   */
  const handleFileChange = (
    fileType: keyof FileState, 
    e: React.ChangeEvent<HTMLInputElement> | File[]
  ) => {
    let selectedFiles: File[];
    
    if (Array.isArray(e)) {
      selectedFiles = e;
    } else if (e.target.files) {
      selectedFiles = Array.from(e.target.files);
    } else {
      return;
    }
    
    const { validFiles, hasInvalidFiles } = validateFiles(
      selectedFiles, 
      fileType as string
    );
    
    if (hasInvalidFiles) {
      setUploadError(`Some files were not valid ${fileType} formats and were removed.`);
    } else {
      setUploadError(null);
    }
    
    const isLogoType = fileType === 'logo';
    updateFileState(fileType, validFiles, isLogoType);
  };
  
  /**
   * Remove file from selection
   */
  const onRemoveFile = (fileType: keyof FileState, index?: number) => {
    if (fileType === 'logo') {
      setFiles(prev => ({ ...prev, logo: null }));
    } else if (index !== undefined) {
      setFiles(prev => ({
        ...prev,
        [fileType]: prev[fileType].filter((_, i) => i !== index)
      }));
    }
  };
  
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
  
  /**
   * Upload logo file if it exists
   */
  const uploadLogoFile = async (businessId: string): Promise<boolean> => {
    if (!files.logo) return true;
    
    const filePath = generateFilePath(businessId, 'logo', files.logo);
    const { success, error } = await uploadSingleFile('business-assets', filePath, files.logo);
    
    if (!success) {
      console.error('Error uploading logo:', error);
      return false;
    }
    
    return true;
  };
  
  /**
   * Upload files of a specific type
   */
  const uploadFilesByType = async (
    businessId: string, 
    fileType: keyof Omit<FileState, 'logo'>
  ): Promise<boolean> => {
    const filesToUpload = files[fileType];
    
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const filePath = generateFilePath(businessId, fileType, file, i);
      const progressKey = `${fileType}-${i}`;
      
      // Initialize progress
      updateProgress(progressKey, file.name, 0);
      
      const { success } = await uploadSingleFile(
        'business-assets', 
        filePath, 
        file, 
        {
          onProgress: (progress) => updateProgress(progressKey, file.name, progress)
        }
      );
      
      if (!success) return false;
    }
    
    return true;
  };
  
  /**
   * Upload all files to storage
   */
  const uploadFiles = async (businessId: string) => {
    setUploading(true);
    
    try {
      // Upload logo first
      const logoSuccess = await uploadLogoFile(businessId);
      if (!logoSuccess) throw new Error('Failed to upload logo');
      
      // Upload other file types
      const fileTypes: Array<keyof Omit<FileState, 'logo'>> = ['images', 'videos', 'documents'];
      
      for (const type of fileTypes) {
        const success = await uploadFilesByType(businessId, type);
        if (!success) throw new Error(`Failed to upload ${type}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Error uploading files. Please try again.');
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    files,
    uploadProgress,
    uploadError,
    uploading,
    handleFileChange,
    onRemoveFile,
    uploadFiles,
    setUploadError
  };
};
