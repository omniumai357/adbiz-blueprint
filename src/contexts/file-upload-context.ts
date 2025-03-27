
import { createContext, useContext, ReactNode, useState } from 'react';
import { FileState, UploadProgressItem } from '@/features/file-upload/types';

export interface FileUploadContextType {
  files: FileState;
  uploadProgress: Record<string, UploadProgressItem>;
  handleFileChange: (fileType: keyof FileState, event: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
  isUploading: boolean;
  hasError: boolean;
  addFile: (fileProps: any) => any;
  removeFile: (fileId: string) => void;
  updateFileStatus: (fileId: string, updates: any) => any;
}

const defaultFiles: FileState = {
  logo: null,
  images: [],
  videos: [],
  documents: []
};

const FileUploadContext = createContext<FileUploadContextType>({
  files: defaultFiles,
  uploadProgress: {},
  handleFileChange: () => {},
  onRemoveFile: () => {},
  isUploading: false,
  hasError: false,
  addFile: () => ({}),
  removeFile: () => {},
  updateFileStatus: () => ({})
});

export const FileUploadProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileState>(defaultFiles);
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressItem>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleFileChange = (
    fileType: keyof FileState,
    event: React.ChangeEvent<HTMLInputElement> | readonly File[]
  ) => {
    // Implementation omitted for brevity
    console.log('File change', fileType, event);
  };

  const onRemoveFile = (fileType: keyof FileState, index?: number) => {
    // Implementation omitted for brevity
    console.log('Remove file', fileType, index);
  };

  // Mock implementations for new methods
  const addFile = (fileProps: any) => {
    console.log('Add file', fileProps);
    return {};
  };

  const removeFile = (fileId: string) => {
    console.log('Remove file', fileId);
  };

  const updateFileStatus = (fileId: string, updates: any) => {
    console.log('Update file status', fileId, updates);
    return {};
  };

  return (
    <FileUploadContext.Provider
      value={{
        files,
        uploadProgress,
        handleFileChange,
        onRemoveFile,
        isUploading,
        hasError,
        addFile,
        removeFile,
        updateFileStatus
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUploadContext = () => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error('useFileUploadContext must be used within a FileUploadProvider');
  }
  return context;
};

// Export FileState type for wider usage
export type { FileState, UploadProgressItem };
