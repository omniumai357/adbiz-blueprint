
import { useState, useCallback, ChangeEvent } from "react";
import { toast } from "sonner";
import { FileState } from "@/hooks/useFileUpload";
import { validateFiles } from "@/utils/file-validation";

export interface UseFileUploadHandlersProps {
  files: FileState;
  setFiles: React.Dispatch<React.SetStateAction<FileState>>;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Hook for handling file upload interactions
 */
export function useFileUploadHandlers({
  files,
  setFiles, 
  setUploadError
}: UseFileUploadHandlersProps) {
  /**
   * Handle file input change
   * @param fileType Type of file being uploaded
   * @param event File input change event
   */
  const handleFileChange = useCallback((
    fileType: keyof FileState,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const newFiles = Array.from(event.target.files);
    setUploadError(null);
    
    // Validate files
    const { validFiles, hasInvalidFiles } = validateFiles(newFiles, fileType);
    
    if (hasInvalidFiles) {
      toast.error(`Some files have invalid types. Only supported formats for ${fileType} were added.`);
    }
    
    if (validFiles.length === 0) return;
    
    // Process valid files
    setFiles(prevFiles => {
      // For logo, replace the existing one (only one logo allowed)
      if (fileType === "logo") {
        return {
          ...prevFiles,
          logo: validFiles[0]
        };
      }
      
      // For other file types, append to existing array
      const existingFiles = prevFiles[fileType] as File[];
      
      return {
        ...prevFiles,
        [fileType]: [...existingFiles, ...validFiles]
      };
    });
    
    // Reset the file input
    event.target.value = "";
  }, [setFiles, setUploadError]);
  
  /**
   * Remove a file from the state
   * @param fileType Type of file to remove
   * @param indexOrFile Index of file to remove, or the file object itself for logo
   */
  const onRemoveFile = useCallback((fileType: keyof FileState, indexOrFile?: number | File) => {
    setFiles(prevFiles => {
      // For logo, set to null
      if (fileType === "logo") {
        return {
          ...prevFiles,
          logo: null
        };
      }
      
      // For other file types, remove by index
      if (typeof indexOrFile === "number") {
        const existingFiles = prevFiles[fileType] as File[];
        
        const updatedFiles = [...existingFiles];
        updatedFiles.splice(indexOrFile, 1);
        
        return {
          ...prevFiles,
          [fileType]: updatedFiles
        };
      }
      
      return prevFiles;
    });
  }, [setFiles]);
  
  return {
    handleFileChange,
    onRemoveFile
  };
}
