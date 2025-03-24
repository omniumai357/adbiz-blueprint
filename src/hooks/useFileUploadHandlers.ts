import { useState } from 'react';

type FileError = string | null;

interface UseFileUploadHandlersResult {
  handleDrop: (acceptedFiles: File[]) => void;
  handleFiles: (files: File | File[]) => void;
  handleRemove: (fileName: string) => void;
  files: File[];
  error: FileError;
  setError: (error: FileError) => void;
}

interface FileValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

const useFileUploadHandlers = (): UseFileUploadHandlersResult => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<FileError>(null);

  const validateFile = (file: File): FileValidationResult => {
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (file.size > maxSizeInBytes) {
      return { isValid: false, errorMessage: `File ${file.name} exceeds the maximum size of 10MB.` };
    }

    if (!allowedFileTypes.includes(file.type)) {
      return { isValid: false, errorMessage: `File ${file.name} has an unsupported file type. Allowed types are JPEG, PNG, GIF, PDF, and DOC(X).` };
    }

    return { isValid: true, errorMessage: null };
  };

  const handleDrop = (acceptedFiles: File[]) => {
    setError(null);
    const newFiles = [...files];

    for (const file of acceptedFiles) {
      const validationResult = validateFile(file);
      if (!validationResult.isValid) {
        setError(validationResult.errorMessage);
        return;
      }
      newFiles.push(file);
    }

    setFiles(newFiles);
  };

  // Fix the error by adding a proper type guard for the file parameter
  const handleFiles = (files: File | File[]) => {
    if (!files) return;
    
    // Convert to array if it's a single file
    const fileList = Array.isArray(files) ? files : [files];
    
    for (const file of fileList) {
      if (!validateFile(file)) {
        setError(`File ${file.name} is not valid. Please check file type and size.`);
        return;
      }
    }

    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      for (const file of fileList) {
        newFiles.push(file);
      }
      return newFiles;
    });
  };

  const handleRemove = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return { handleDrop, handleFiles, handleRemove, files, error, setError };
};

export default useFileUploadHandlers;
