
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

// File type validation utility
const fileTypeIsValid = (file: File, allowedTypes: string[]) => {
  return allowedTypes.includes(file.type);
};

interface FileState {
  logo: File | null;
  images: File[];
  videos: File[];
  documents: File[];
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileState>({
    logo: null,
    images: [],
    videos: [],
    documents: [],
  });
  const [uploadProgress, setUploadProgress] = useState<Record<string, { name: string; progress: number }>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | File[], fileType: keyof FileState) => {
    let selectedFiles: File[];
    
    if (Array.isArray(e)) {
      selectedFiles = e;
    } else if (e.target.files) {
      selectedFiles = Array.from(e.target.files);
    } else {
      return;
    }
    
    // Validate file types
    const allowedTypes: Record<string, string[]> = {
      logo: ['image/jpeg', 'image/png', 'image/svg+xml'],
      images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      videos: ['video/mp4', 'video/quicktime', 'video/webm'],
      documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    };
    
    // Check if files are valid
    const validFiles = selectedFiles.filter(file => 
      fileTypeIsValid(file, allowedTypes[fileType])
    );
    
    if (validFiles.length !== selectedFiles.length) {
      setUploadError(`Some files were not valid ${fileType} formats and were removed.`);
    } else {
      setUploadError(null);
    }
    
    if (fileType === 'logo') {
      setFiles(prev => ({ ...prev, [fileType]: validFiles[0] }));
    } else {
      setFiles(prev => ({ ...prev, [fileType]: [...prev[fileType], ...validFiles] }));
    }
  };
  
  // Remove file from selection
  const onRemoveFile = (fileType: keyof FileState, index?: number) => {
    if (fileType === 'logo') {
      setFiles(prev => ({ ...prev, logo: null }));
    } else if (index !== undefined) {
      setFiles(prev => ({
        ...prev,
        [fileType]: prev[fileType].filter((_, i) => i !== index)
      }));
    }
  };
  
  // Upload files to storage
  const uploadFiles = async (businessId: string) => {
    setUploading(true);
    
    try {
      // Upload logo if exists
      if (files.logo) {
        const fileExt = files.logo.name.split('.').pop();
        const filePath = `${businessId}/logo.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('business-assets')
          .upload(filePath, files.logo, {
            cacheControl: '3600',
          });
          
        if (error) throw error;
      }
      
      // Upload other file types
      const fileTypes = ['images', 'videos', 'documents'] as const;
      
      for (const type of fileTypes) {
        for (let i = 0; i < files[type].length; i++) {
          const file = files[type][i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${i}.${fileExt}`;
          const filePath = `${businessId}/${type}/${fileName}`;
          
          setUploadProgress(prev => ({
            ...prev,
            [`${type}-${i}`]: {
              name: file.name,
              progress: 0,
            }
          }));
          
          const { error } = await supabase.storage
            .from('business-assets')
            .upload(filePath, file, {
              cacheControl: '3600',
            });
            
          if (error) throw error;
          
          // Update progress to complete
          setUploadProgress(prev => ({
            ...prev,
            [`${type}-${i}`]: {
              name: file.name,
              progress: 100,
            }
          }));
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Error uploading files. Please try again.');
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    files,
    uploadProgress,
    uploadError,
    uploading,
    handleFileChange,
    onRemoveFile,
    uploadFiles,
    setUploadError
  };
};
