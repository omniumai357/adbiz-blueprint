
import { useState } from 'react';
import { useFileUploadState } from './useFileUploadState';
import { useFileUploadProgress } from './useFileUploadProgress';
import useFileUploadHandlers from './file-upload/useFileUploadHandlers';

export interface FileState {
  logo: File | null;
  images: File[];
  videos: File[];
  documents: File[];
}

/**
 * Main hook for file upload functionality
 * This is a composition of more specialized hooks
 */
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Use specialized sub-hooks
  const { files, setFiles } = useFileUploadState();
  const { uploadProgress, updateProgress, resetProgress } = useFileUploadProgress();
  const { handleFileChange, onRemoveFile } = useFileUploadHandlers({
    files,
    setFiles,
    setUploadError
  });

  /**
   * Reset all file upload state
   */
  const resetFileUpload = () => {
    setFiles({
      logo: null,
      images: [],
      videos: [],
      documents: []
    });
    resetProgress();
    setUploadError(null);
  };

  return {
    files,
    uploadProgress,
    uploadError,
    uploading,
    setUploading,
    handleFileChange,
    onRemoveFile,
    uploadProgress,
    updateProgress,
    resetProgress,
    resetFileUpload,
    setUploadError
  };
};
