
import { ChangeEvent } from 'react';
import { FileState } from '@/hooks/useFileUpload';
import { validateFiles } from '@/utils/file-validation';
import { useToast } from '@/hooks/ui/use-toast';

export interface UseFileUploadHandlersProps {
  files: FileState;
  setFiles: (files: FileState) => void;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Hook for handling file upload operations like adding and removing files
 */
const useFileUploadHandlers = ({ files, setFiles, setUploadError }: UseFileUploadHandlersProps) => {
  const { toast } = useToast();

  /**
   * Handle file input change
   * @param fileType - Type of file being uploaded (logo, images, videos, documents)
   * @param event - File input change event or File array
   */
  const handleFileChange = (
    fileType: keyof FileState,
    event: ChangeEvent<HTMLInputElement> | readonly File[]
  ) => {
    let selectedFiles: File[] = [];
    
    // Handle both File array and input change event
    if (Array.isArray(event)) {
      selectedFiles = [...event];
    } else if (event.target.files) {
      selectedFiles = Array.from(event.target.files);
    }
    
    if (selectedFiles.length === 0) return;
    
    // Validate file types
    const { validFiles, hasInvalidFiles } = validateFiles(selectedFiles, fileType);
    
    if (hasInvalidFiles) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Some files were not added because they are not supported for ${fileType}.`,
      });
    }
    
    // Special handling for logo (single file)
    if (fileType === 'logo') {
      if (validFiles.length > 0) {
        const logoFile = validFiles[0];
        
        setFiles({ ...files, logo: logoFile });
      }
      return;
    }
    
    // Handle multiple files (images, videos, documents)
    // Update files state
    setFiles({
      ...files,
      [fileType]: [...files[fileType], ...validFiles],
    });
  };
  
  /**
   * Remove a file from the files state
   * @param fileType - Type of file to remove (logo, images, videos, documents)
   * @param index - Index of file to remove (only for arrays of files)
   */
  const onRemoveFile = (fileType: keyof FileState, index?: number) => {
    // Handle logo (single file)
    if (fileType === 'logo') {
      setFiles({ ...files, logo: null });
      return;
    }
    
    // Handle arrays of files (images, videos, documents)
    if (typeof index === 'number') {
      const updatedFiles = [...files[fileType]];
      updatedFiles.splice(index, 1);
      setFiles({
        ...files,
        [fileType]: updatedFiles,
      });
    }
  };
  
  return {
    handleFileChange,
    onRemoveFile,
  };
};

export default useFileUploadHandlers;
