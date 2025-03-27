import { FileState } from '@/contexts/file-upload-context';
import { validateFiles } from '@/utils/file-validation';

export interface UseFileUploadHandlersProps {
  files: FileState;
  setFiles: React.Dispatch<React.SetStateAction<FileState>>;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface UseFileUploadHandlersResult {
  handleFileChange: (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
}

/**
 * Custom hook for handling file upload interactions
 * Provides functions to add and remove files from different categories
 */
export const useFileUploadHandlers = ({
  files,
  setFiles,
  setUploadError
}: UseFileUploadHandlersProps): UseFileUploadHandlersResult => {
  const handleFileChange = (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => {
    let newFiles: File[] = [];
    
    // Handle event input
    if ('target' in e && e.target.files) {
      newFiles = Array.from(e.target.files);
    } 
    // Handle direct array of files
    else if (Array.isArray(e)) {
      newFiles = Array.from(e);
    }
    
    if (newFiles.length === 0) return;

    // For logo, we only keep one file
    if (fileType === 'logo') {
      const { validFiles, hasInvalidFiles } = validateFiles([newFiles[0]], fileType);
      
      if (hasInvalidFiles) {
        setUploadError(`Invalid file type. Please use a supported format.`);
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [fileType]: validFiles[0]
      }));
      return;
    }
    
    // For other file types, we append to existing files
    const { validFiles, hasInvalidFiles } = validateFiles(newFiles, fileType);
    
    if (hasInvalidFiles) {
      setUploadError(`Some files have invalid types. Only supported formats were added.`);
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => ({
        ...prev,
        [fileType]: [...prev[fileType], ...validFiles]
      }));
    }
  };

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
        [fileType]: prev[fileType].filter((_, i) => i !== index)
      }));
    }
  };

  return {
    handleFileChange,
    onRemoveFile
  };
};
