import { useState } from 'react';
import { FileState } from '@/hooks/useFileUpload';
import { useFileValidation } from './useFileValidation';

export interface UseFileUploadHandlersProps {
  files: FileState;
  setFiles: React.Dispatch<React.SetStateAction<FileState>>;
}

export interface UseFileUploadHandlersResult {
  uploadError: string | null;
  handleFileChange: (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
}

const useFileUploadHandlers = (props: UseFileUploadHandlersProps): UseFileUploadHandlersResult => {
  const { files, setFiles } = props;
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { validateFileUpload } = useFileValidation();

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
      const { validFiles, hasError } = validateFileUpload([newFiles[0]], fileType);
      
      if (hasError && validFiles.length === 0) {
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [fileType]: validFiles[0]
      }));
      return;
    }
    
    // For other file types, we append to existing files
    const { validFiles } = validateFileUpload(newFiles, fileType);
    
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
    uploadError,
    handleFileChange,
    onRemoveFile,
    setUploadError
  };
};

export default useFileUploadHandlers;
