
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileState, FileItem, UploadProgressItem, FileUploadHook } from '@/features/file-upload/types';

interface FileUploadContextType extends FileUploadHook {}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

// Initial state with empty arrays for file collections
const initialState: FileState = {
  identity: [],
  business: [],
  additional: [],
  logo: null,
  images: [],
  videos: [],
  documents: []
};

export const FileUploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileState>(initialState);
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressItem>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Handle file changes from input
  const handleFileChange = (fileType: keyof FileState, event: React.ChangeEvent<HTMLInputElement> | readonly File[]) => {
    let selectedFiles: File[] = [];
    
    if (Array.isArray(event)) {
      // Handle direct array of files
      selectedFiles = [...event];
    } else if (event.target.files) {
      // Handle event from file input
      selectedFiles = Array.from(event.target.files);
    }

    if (selectedFiles.length === 0) return;

    if (fileType === 'logo' && selectedFiles.length > 0) {
      // Logo is a special case - single file only
      setFiles(prev => ({
        ...prev,
        logo: selectedFiles[0]
      }));
      return;
    }

    // For arrays, create FileItems with IDs and add to the correct array
    const newFileItems: FileItem[] = selectedFiles.map(file => ({
      id: uuidv4(),
      file,
      progress: 0
    }));

    setFiles(prev => ({
      ...prev,
      [fileType]: [...(prev[fileType] as FileItem[]), ...newFileItems]
    }));
  };

  // Remove a file from the collection
  const onRemoveFile = (fileType: keyof FileState, index?: number) => {
    if (fileType === 'logo') {
      setFiles(prev => ({
        ...prev,
        logo: null
      }));
      return;
    }

    if (index !== undefined) {
      setFiles(prev => ({
        ...prev,
        [fileType]: (prev[fileType] as FileItem[]).filter((_, i) => i !== index)
      }));
    }
  };

  // Update progress for a file upload
  const updateProgress = (key: string, name: string, progress: number) => {
    setUploadProgress(prev => ({
      ...prev,
      [key]: { fileName: name, progress }
    }));
  };

  // Reset progress for all or a specific file
  const resetProgress = (key?: string) => {
    if (key) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[key];
        return newProgress;
      });
    } else {
      setUploadProgress({});
    }
  };

  // Reset file upload state
  const resetFileUpload = () => {
    setFiles(initialState);
    setUploadProgress({});
    setUploadError(null);
  };

  // Upload all files to storage
  const uploadFiles = async (businessId: string): Promise<boolean> => {
    setUploading(true);
    setUploadError(null);
    
    try {
      // Mock successful upload for now - to be implemented with actual file upload logic
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

  const value: FileUploadContextType = {
    files,
    uploadProgress,
    uploadError,
    uploading,
    handleFileChange,
    onRemoveFile,
    updateProgress,
    resetProgress,
    resetFileUpload,
    uploadFiles
  };

  return (
    <FileUploadContext.Provider value={value}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUploadContext = (): FileUploadContextType => {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error('useFileUploadContext must be used within a FileUploadProvider');
  }
  return context;
};
