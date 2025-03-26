
import { useState } from 'react';
import { FileState } from '@/hooks/useFileUpload';
import { uploadSingleFile, generateFilePath } from '@/utils/file-upload';
import { useFileUploadContext } from '@/contexts/file-upload-context';

/**
 * Hook to handle all file upload operations to storage
 */
export const useFileUploadService = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { files, uploadProgress, setUploadError } = useFileUploadContext();

  /**
   * Upload a single file to storage
   * @param businessId - ID of the business
   * @param fileType - Type of file (logo, images, videos, documents)
   * @param file - The file to upload
   * @param index - Optional index for array files
   * @returns Promise with upload result
   */
  const uploadFile = async (
    businessId: string,
    fileType: keyof FileState,
    file: File,
    index?: number
  ): Promise<{ success: boolean; url?: string }> => {
    try {
      const filePath = generateFilePath(businessId, fileType, file, index);
      const bucket = 'business-files';
      
      const { success, error, publicUrl } = await uploadSingleFile(bucket, filePath, file, {
        onProgress: (progress) => {
          // Update progress tracking
          const fileId = `${fileType}-${index || 0}`;
          // Update progress logic would go here
        }
      });
      
      if (!success || error) {
        throw error || new Error(`Failed to upload ${fileType}`);
      }
      
      return { success: true, url: publicUrl };
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      setUploadError(`Failed to upload ${fileType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false };
    }
  };
  
  /**
   * Upload all files for a business
   * @param businessId - ID of the business
   * @returns Promise with boolean indicating success
   */
  const uploadAllFiles = async (businessId: string): Promise<boolean> => {
    if (!businessId) {
      setUploadError('Missing business ID for file upload');
      return false;
    }
    
    setIsUploading(true);
    
    try {
      const uploadResults: { type: string; success: boolean; url?: string }[] = [];
      
      // Upload logo if present
      if (files.logo) {
        const logoResult = await uploadFile(businessId, 'logo', files.logo);
        uploadResults.push({ type: 'logo', ...logoResult });
      }
      
      // Upload images
      for (let i = 0; i < files.images.length; i++) {
        const imageResult = await uploadFile(businessId, 'images', files.images[i], i);
        uploadResults.push({ type: 'image', ...imageResult });
      }
      
      // Upload videos
      for (let i = 0; i < files.videos.length; i++) {
        const videoResult = await uploadFile(businessId, 'videos', files.videos[i], i);
        uploadResults.push({ type: 'video', ...videoResult });
      }
      
      // Upload documents
      for (let i = 0; i < files.documents.length; i++) {
        const docResult = await uploadFile(businessId, 'documents', files.documents[i], i);
        uploadResults.push({ type: 'document', ...docResult });
      }
      
      // Check if any uploads failed
      const hasFailures = uploadResults.some(result => !result.success);
      
      if (hasFailures) {
        setUploadError('Some files failed to upload. Please try again.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('An unexpected error occurred during file upload');
      return false;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadFile,
    uploadAllFiles,
    isUploading
  };
};
