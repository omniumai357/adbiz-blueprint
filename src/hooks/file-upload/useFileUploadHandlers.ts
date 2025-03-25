
import { useState } from 'react';
import { FileState } from '@/hooks/useFileUpload';
import { useFileValidation } from './useFileValidation';
import { toast } from '@/hooks/ui/use-toast';

export interface UseFileUploadHandlersProps {
  files: FileState;
  setFiles: React.Dispatch<React.SetStateAction<FileState>>;
  setUploadError?: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface UseFileUploadHandlersResult {
  uploadError: string | null;
  handleFileChange: (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
}

const useFileUploadHandlers = (props: UseFileUploadHandlersProps): UseFileUploadHandlersResult => {
  const { files, setFiles, setUploadError: propsSetUploadError } = props;
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { validateFileUpload, formatFileSize } = useFileValidation();

  // Use the provided setUploadError function if available, otherwise use the local one
  const handleUploadError = (error: string | null) => {
    if (propsSetUploadError) {
      propsSetUploadError(error);
    }
    setUploadError(error);
  };

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
      
      if (validFiles.length > 0) {
        toast({
          title: "Logo uploaded",
          description: `${validFiles[0].name} (${formatFileSize(validFiles[0].size)}) added successfully.`
        });
      }
      
      return;
    }
    
    // For other file types, we append to existing files
    const { validFiles, hasError } = validateFileUpload(newFiles, fileType);
    
    if (validFiles.length > 0) {
      setFiles(prev => ({
        ...prev,
        [fileType]: [...prev[fileType], ...validFiles]
      }));
      
      if (!hasError) {
        toast({
          title: `${validFiles.length} ${fileType} added`,
          description: `Files were added successfully.`
        });
      }
    }
  };

  const onRemoveFile = (fileType: keyof FileState, index?: number) => {
    if (fileType === 'logo') {
      setFiles(prev => ({
        ...prev,
        logo: null
      }));
      toast({
        title: "Logo removed",
        description: "The logo file has been removed."
      });
      return;
    }
    
    if (index !== undefined) {
      setFiles(prev => {
        const fileName = prev[fileType][index]?.name;
        const newFiles = prev[fileType].filter((_, i) => i !== index);
        
        if (fileName) {
          toast({
            title: "File removed",
            description: `"${fileName}" has been removed.`
          });
        }
        
        return { ...prev, [fileType]: newFiles };
      });
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
