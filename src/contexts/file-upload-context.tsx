
import { createContext, useContext, ReactNode } from 'react';
import { 
  useFileUpload, 
  FileState, 
  UploadProgressItem 
} from '@/features/file-upload';

// Define the context value type
interface FileUploadContextType {
  files: FileState;
  uploadProgress: Record<string, UploadProgressItem>;
  uploadError: string | null;
  uploading: boolean;
  handleFileChange: (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
  updateProgress: (key: string, name: string, progress: number) => void;
  resetProgress: (key?: string) => void;
  resetFileUpload: () => void;
  uploadFiles: (businessId: string) => Promise<boolean>;
}

// Create the context with a default value
const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

// Provider component
export const FileUploadProvider = ({ children }: { children: ReactNode }) => {
  const fileUpload = useFileUpload();
  
  return (
    <FileUploadContext.Provider value={fileUpload}>
      {children}
    </FileUploadContext.Provider>
  );
};

// Custom hook to use the context
export const useFileUploadContext = () => {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error('useFileUploadContext must be used within a FileUploadProvider');
  }
  return context;
};
