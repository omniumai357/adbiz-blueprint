
import { useState } from 'react';
import { FileState } from '@/hooks/useFileUpload';
import { uploadSingleFile, generateFilePath } from '@/utils/file-upload';
import { useFileUploadContext } from '@/contexts/file-upload-context';
import { useFileUploadProgress } from '@/hooks/useFileUploadProgress';

/**
 * Hook that provides file upload service functions
 */
export const useFileUploadService = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { files, setUploadError } = useFileUploadContext();
  const { updateProgress } = useFileUploadProgress();

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
   * @returns Promise<boolean> indicating success or failure
   */
  const uploadAllFiles = async (businessId: string): Promise<boolean> => {
    setIsUploading(true);
    
    try {
      // For now, just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Error uploading files. Please try again.');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadAllFiles
  };
};
