import { useState } from 'react';
import { validateFiles } from '@/utils/file-validation';
import { uploadSingleFile, generateFilePath } from '@/utils/file-upload';
import { useFileUploadState } from './useFileUploadState';
import { useFileUploadHandlers } from './useFileUploadHandlers';
import { useFileUploadProgress } from './useFileUploadProgress';

export interface FileState {
  logo: File | null;
  images: File[];
  videos: File[];
  documents: File[];
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const { files, setFiles } = useFileUploadState();
  const { uploadProgress, updateProgress } = useFileUploadProgress();
  const { handleFileChange, onRemoveFile } = useFileUploadHandlers({
    files,
    setFiles,
    setUploadError,
    validateFiles
  });

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
      const logoSuccess = await uploadLogoFile(businessId);
      if (!logoSuccess) throw new Error('Failed to upload logo');
      
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
