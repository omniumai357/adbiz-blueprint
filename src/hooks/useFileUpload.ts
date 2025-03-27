
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
  
  const {
    handleFileChange,
    onRemoveFile,
    uploadFile,
    uploadFiles
  } = useFileUploadHandlers();
  
  // Reset selected files when files in context change
  useEffect(() => {
    setSelectedFiles([]);
  }, [files]);
  
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
    uploadFiles
  };
};
