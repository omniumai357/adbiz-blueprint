
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type UploadedFile = {
  name: string;
  size: number;
  type: string;
  path: string;
  url: string;
};

export const useFileUploadService = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      // Add to local state
      const newFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
        url: urlData.publicUrl,
      };
      
      setUploadedFiles(prev => [...prev, newFile]);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during upload'));
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    uploadedFiles,
    isUploading,
    error
  };
};
