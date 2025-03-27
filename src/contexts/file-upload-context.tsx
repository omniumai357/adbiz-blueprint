
import React, { createContext, useContext, ReactNode } from 'react';
import { FileState, FileItem, UploadProgressItem, FileUploadHook } from '@/features/file-upload/types';
import { useFileUpload } from '@/features/file-upload/hooks/useFileUpload';

// Create a context with the hook's return type
const FileUploadContext = createContext<FileUploadHook | undefined>(undefined);

// Provider component that wraps the application
export const FileUploadProvider = ({ children }: { children: ReactNode }) => {
  // Use the feature-based hook directly
  const fileUploadState = useFileUpload();
  
  return (
    <FileUploadContext.Provider value={fileUploadState}>
      {children}
    </FileUploadContext.Provider>
  );
};

// Custom hook for accessing the context
export const useFileUploadContext = (): FileUploadHook => {
  const context = useContext(FileUploadContext);
  
  if (context === undefined) {
    throw new Error('useFileUploadContext must be used within a FileUploadProvider');
  }
  
  return context;
};
