
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { FileState } from '@/hooks/useFileUpload';
import { useFileUploadState } from '@/hooks/useFileUploadState';
import { useFileUploadProgress } from '@/hooks/useFileUploadProgress';
import useFileUploadHandlers from '@/hooks/file-upload/useFileUploadHandlers';

interface FileUploadContextType {
  files: FileState;
  uploadProgress: Record<string, { name: string; progress: number }>;
  uploadError: string | null;
  uploading: boolean;
  handleFileChange: (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
  resetUploadState: () => void;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export const FileUploadProvider = ({ children }: { children: ReactNode }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { files, setFiles, clearFiles } = useFileUploadState();
  const { uploadProgress, resetProgress } = useFileUploadProgress();
  const { handleFileChange, onRemoveFile } = useFileUploadHandlers({ 
    files, 
    setFiles,
    setUploadError
  });

  const resetUploadState = () => {
    clearFiles();
    resetProgress();
    setUploadError(null);
  };

  return (
    <FileUploadContext.Provider value={{
      files,
      uploadProgress,
      uploadError,
      uploading,
      handleFileChange,
      onRemoveFile,
      setUploadError,
      resetUploadState
    }}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUploadContext = () => {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error('useFileUploadContext must be used within a FileUploadProvider');
  }
  return context;
};
