
import { FileState, FileItem } from '@/features/file-upload/types';
import { useState, useEffect } from 'react';
import { useFileUploadContext } from '@/contexts/file-upload-context';
import { fileAdapter } from '@/utils/file-adapter';

/**
 * Hook that adapts FileItems from the context to plain File objects for UI components
 */
export const useFileToUIAdapter = () => {
  const { files } = useFileUploadContext();
  const [adaptedFiles, setAdaptedFiles] = useState(() => fileAdapter.adaptFileStateForUI(files));
  
  // Update adapted files when context files change
  useEffect(() => {
    setAdaptedFiles(fileAdapter.adaptFileStateForUI(files));
  }, [files]);
  
  return {
    adaptedFiles,
    fileStateForUI: adaptedFiles
  };
};
