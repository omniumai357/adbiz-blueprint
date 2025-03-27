
import { useState, useCallback } from 'react';
import { FileState, FileUploadState, FileUploadProps } from '@/features/file-upload/types';

export interface UploadHandlersResult {
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, category: string) => void;
  handleFileRemove: (fileId: string, category: string) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>, category: string) => void;
  handleCancelUpload: (fileId: string, category: string) => void;
  isDragging: boolean;
}

/**
 * Hook for handling file upload actions
 */
export function useFileUploadHandlers(
  files: FileUploadState,
  setFiles: React.Dispatch<React.SetStateAction<FileUploadState>>,
  uploadFile: (file: File, category: string) => Promise<void>,
  validateFile: (file: File, options: FileUploadProps) => { valid: boolean; error?: string }
): UploadHandlersResult {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const newFiles: File[] = Array.from(fileList);
    processFiles(newFiles, category);
    
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  }, []);

  const handleFileRemove = useCallback((fileId: string, category: string) => {
    setFiles(prevFiles => {
      const updatedCategory = { ...prevFiles[category] };
      delete updatedCategory[fileId];
      return { ...prevFiles, [category]: updatedCategory };
    });
  }, [setFiles]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>, category: string) => {
    event.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = event.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;
    
    const newFiles: File[] = Array.from(droppedFiles);
    processFiles(newFiles, category);
  }, []);

  const processFiles = useCallback((newFiles: File[], category: string) => {
    // Process each file individually
    newFiles.forEach(file => {
      // Validate file before adding it
      const validation = validateFile(file, { 
        category,
        maxSizeMB: 5,
        acceptedFileTypes: ['image/*', 'application/pdf'] 
      });

      if (!validation.valid) {
        // Handle invalid file
        console.error(`File validation error: ${validation.error}`);
        return;
      }

      // Generate unique ID for the file
      const fileId = `${Date.now()}-${file.name}`;
      
      // Add file to state
      setFiles(prevFiles => {
        const categoryFiles = prevFiles[category] || {};
        return {
          ...prevFiles,
          [category]: {
            ...categoryFiles,
            [fileId]: {
              id: fileId,
              file,
              name: file.name,
              size: file.size,
              type: file.type,
              progress: 0,
              status: 'pending',
              error: null,
              url: null
            }
          }
        };
      });

      // Start uploading the file
      uploadFile(file, category)
        .then(() => {
          // Upload success
          setFiles(prevFiles => {
            const categoryFiles = prevFiles[category] || {};
            return {
              ...prevFiles,
              [category]: {
                ...categoryFiles,
                [fileId]: {
                  ...categoryFiles[fileId],
                  status: 'success',
                  progress: 100
                }
              }
            };
          });
        })
        .catch(error => {
          // Upload error
          setFiles(prevFiles => {
            const categoryFiles = prevFiles[category] || {};
            return {
              ...prevFiles,
              [category]: {
                ...categoryFiles,
                [fileId]: {
                  ...categoryFiles[fileId],
                  status: 'error',
                  error: error.message || 'Upload failed'
                }
              }
            };
          });
        });
    });
  }, [setFiles, uploadFile, validateFile]);

  const handleCancelUpload = useCallback((fileId: string, category: string) => {
    // Implement cancel upload logic here
    // For now, just remove the file from state
    handleFileRemove(fileId, category);
  }, [handleFileRemove]);

  return {
    handleFileSelect,
    handleFileRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCancelUpload,
    isDragging
  };
}
