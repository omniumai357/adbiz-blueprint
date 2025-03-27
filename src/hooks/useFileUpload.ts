
import { useFileUploadContext } from '@/contexts/file-upload-context';
import { FileState, FileItem } from '@/features/file-upload/types';
import { useEffect, useState } from 'react';

// Re-export types from the features module for backward compatibility
export type { FileState, FileItem };

export const useFileUpload = (options = {}) => {
  const { 
    files, 
    isUploading,
    uploadError: contextUploadError,
    uploadProgress
  } = useFileUploadContext();
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const hasError = !!uploadError || !!contextUploadError;
  
  // Reset selected files when files in context change
  useEffect(() => {
    setSelectedFiles([]);
  }, [files]);
  
  // Get handlers from context
  const {
    handleFileChange,
    onRemoveFile,
    uploadFiles: contextUploadFiles,
    resetFileUpload
  } = useFileUploadContext();
  
  // Expose a simplified uploadFiles function that matches expected signature
  const uploadFilesToStorage = async (businessId: string): Promise<boolean> => {
    setUploading(true);
    try {
      const result = await contextUploadFiles(businessId);
      return result;
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Failed to upload files');
      return false;
    } finally {
      setUploading(false);
    }
  };
  
  // Mock function for single file upload
  const uploadFile = async (file: File, path: string): Promise<string> => {
    // Simulate successful upload
    await new Promise(resolve => setTimeout(resolve, 500));
    return `https://example.com/uploads/${path}/${file.name}`;
  };
  
  return {
    files,
    isUploading: isUploading || uploading,
    hasError,
    uploadProgress,
    handleFileChange,
    onRemoveFile,
    selectedFiles,
    setSelectedFiles,
    uploadFile,
    uploadFiles: uploadFilesToStorage,
    uploadError: uploadError || contextUploadError,
    uploading,
    setUploadError,
    resetFileUpload
  };
};
