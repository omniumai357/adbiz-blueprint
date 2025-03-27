
import { useState, useCallback } from 'react';
import { useFileUploadContext } from '@/contexts/file-upload-context';
import { FileState } from '@/contexts/file-upload-context';

export interface UploadHandlersResult {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileId: string) => void;
  uploadFile: (file: File, metadata?: Record<string, any>) => Promise<FileState>;
  uploadFiles: (files: FileList | File[], metadata?: Record<string, any>) => Promise<FileState[]>;
}

export const useFileUploadHandlers = (): UploadHandlersResult => {
  const { addFile, removeFile, updateFileStatus } = useFileUploadContext();
  const [activeUploads, setActiveUploads] = useState<Record<string, boolean>>({});

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      uploadFile(file);
    });
    
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  }, []);

  const uploadFile = useCallback(async (file: File, metadata?: Record<string, any>): Promise<FileState> => {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add file to context
    const fileState = addFile({
      id: fileId,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      metadata: metadata || {}
    });
    
    setActiveUploads(prev => ({ ...prev, [fileId]: true }));
    
    try {
      // Simulate upload progress
      const updateProgress = (progress: number) => {
        updateFileStatus(fileId, { 
          progress, 
          status: progress === 100 ? 'uploaded' : 'uploading' 
        });
      };
      
      await simulateFileUpload(updateProgress);
      
      // Update file status to uploaded
      const updatedFileState = updateFileStatus(fileId, { 
        status: 'uploaded', 
        progress: 100,
        url: URL.createObjectURL(file) 
      });
      
      return updatedFileState;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorFileState = updateFileStatus(fileId, { 
        status: 'error', 
        error: errorMessage 
      });
      return errorFileState;
    } finally {
      setActiveUploads(prev => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      });
    }
  }, [addFile, updateFileStatus]);

  const uploadFiles = useCallback(async (files: FileList | File[], metadata?: Record<string, any>): Promise<FileState[]> => {
    const fileArray = Array.from(files);
    const promises = fileArray.map(file => uploadFile(file, metadata));
    return Promise.all(promises);
  }, [uploadFile]);

  const onRemoveFile = useCallback((fileId: string) => {
    removeFile(fileId);
  }, [removeFile]);

  return {
    handleFileChange,
    onRemoveFile,
    uploadFile,
    uploadFiles
  };
};

// Helper function to simulate file upload
const simulateFileUpload = (progressCallback: (progress: number) => void): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      progressCallback(progress);
      if (progress >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
};
