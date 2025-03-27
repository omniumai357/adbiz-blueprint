
import { useFileUploadContext } from '@/contexts/file-upload-context';
import { useFileUploadHandlers } from './file-upload/useFileUploadHandlers';
import { useEffect, useState } from 'react';

export const useFileUpload = (options = {}) => {
  const { 
    files, 
    isUploading,
    hasError,
    uploadProgress
  } = useFileUploadContext();
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const fileUploadHandlers = useFileUploadHandlers();
  
  const {
    handleFileChange,
    onRemoveFile,
    uploadFile,
    uploadFiles
  } = fileUploadHandlers;
  
  // Reset selected files when files in context change
  useEffect(() => {
    setSelectedFiles([]);
  }, [files]);
  
  // Expose a simplified uploadFiles function that matches expected signature
  const uploadFilesToStorage = async (businessId: string): Promise<boolean> => {
    setUploading(true);
    try {
      // Mock successful upload
      console.log(`Uploading files for business: ${businessId}`);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Failed to upload files');
      return false;
    } finally {
      setUploading(false);
    }
  };
  
  return {
    files,
    isUploading,
    hasError,
    uploadProgress,
    handleFileChange,
    onRemoveFile,
    selectedFiles,
    setSelectedFiles,
    uploadFile,
    uploadFiles: uploadFilesToStorage,
    uploadError,
    uploading,
    setUploadError
  };
};
