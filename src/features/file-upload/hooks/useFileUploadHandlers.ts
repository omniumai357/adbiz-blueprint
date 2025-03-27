
import { useState, useCallback } from 'react';
import { useFileUploadContext } from '@/contexts/file-upload-context';
import { FileState, FileItem } from '@/features/file-upload/types';

export interface UploadHandlersResult {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileId: string) => void;
  uploadFile: (file: File, metadata?: Record<string, any>) => Promise<any>;
  uploadFiles: (files: FileList | File[], metadata?: Record<string, any>) => Promise<any[]>;
}

export const useFileUploadHandlers = (): UploadHandlersResult => {
  const { files, handleFileChange: contextHandleFileChange, onRemoveFile: contextRemoveFile } = useFileUploadContext();
  const [activeUploads, setActiveUploads] = useState<Record<string, boolean>>({});

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Use the file input event directly with the context
    contextHandleFileChange('images', e);
    
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  }, [contextHandleFileChange]);

  const uploadFile = useCallback(async (file: File, metadata?: Record<string, any>): Promise<any> => {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Add file to tracked uploads
    setActiveUploads(prev => ({ ...prev, [fileId]: true }));
    
    try {
      // Simulate upload progress
      await simulateFileUpload();
      
      return { id: fileId, file, status: 'uploaded' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { id: fileId, file, status: 'error', error: errorMessage };
    } finally {
      setActiveUploads(prev => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      });
    }
  }, []);

  const uploadFiles = useCallback(async (files: FileList | File[], metadata?: Record<string, any>): Promise<any[]> => {
    const fileArray = Array.from(files);
    const promises = fileArray.map(file => uploadFile(file, metadata));
    return Promise.all(promises);
  }, [uploadFile]);

  const onRemoveFile = useCallback((fileId: string) => {
    // Convert fileId to keyof FileState or number
    if (fileId === 'logo' || fileId === 'images' || fileId === 'videos' || fileId === 'documents' || 
        fileId === 'identity' || fileId === 'business' || fileId === 'additional') {
      // It's a file type
      contextRemoveFile(fileId as keyof FileState);
    } else {
      // Try to handle as an index
      const index = parseInt(fileId, 10);
      if (!isNaN(index)) {
        // Need to know which collection - assume images as default
        contextRemoveFile('images', index);
      }
    }
  }, [contextRemoveFile]);

  return {
    handleFileChange,
    onRemoveFile,
    uploadFile,
    uploadFiles
  };
};

// Helper function to simulate file upload
const simulateFileUpload = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};
