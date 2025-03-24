
import { useState } from 'react';
import { FileState } from './useFileUpload';

export const useFileUploadState = () => {
  const [files, setFiles] = useState<FileState>({
    logo: null,
    images: [],
    videos: [],
    documents: [],
  });

  return { files, setFiles };
};
