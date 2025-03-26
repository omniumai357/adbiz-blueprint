
import { useState, useCallback, ChangeEvent } from "react";
import { toast } from "sonner";
import { FileState } from "@/hooks/useFileUpload";
import { validateFile } from "@/utils/file-validation";

export function useFileUploadHandlers(
  initialState: FileState = { logo: null, images: [], videos: [], documents: [] }
) {
  const [files, setFiles] = useState<FileState>(initialState);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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
    
    // Validate each file
    const invalidFiles = newFiles.filter(file => {
      const { valid, message } = validateFile(file, fileType);
      if (!valid && message) {
        toast.error(message);
        return true;
      }
      return false;
    });
    
    // If any files are invalid, don't process further
    if (invalidFiles.length > 0) return;
    
    // Process valid files
    setFiles(prevFiles => {
      // For logo, replace the existing one (only one logo allowed)
      if (fileType === "logo") {
        return {
          ...prevFiles,
          logo: newFiles[0]
        };
      }
      
      // For other file types, append to existing array
      // Make sure we convert it to an array first if it's not already
      const existingFiles = Array.isArray(prevFiles[fileType]) ? 
        prevFiles[fileType] as File[] : 
        [];
      
      return {
        ...prevFiles,
        [fileType]: [...existingFiles, ...newFiles]
      };
    });
    
    // Reset the file input
    event.target.value = "";
  }, []);
  
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
        // Make sure we're dealing with an array
        const existingFiles = Array.isArray(prevFiles[fileType]) ? 
          prevFiles[fileType] as File[] : 
          [];
        
        const updatedFiles = [...existingFiles];
        updatedFiles.splice(indexOrFile, 1);
        
        return {
          ...prevFiles,
          [fileType]: updatedFiles
        };
      }
      
      return prevFiles;
    });
  }, []);
  
  return {
    files,
    setFiles,
    handleFileChange,
    onRemoveFile,
    uploadError,
    setUploadError
  };
}
