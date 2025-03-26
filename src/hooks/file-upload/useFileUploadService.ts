
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFileUploadContext } from '@/features/file-upload';

export const useFileUploadService = () => {
  const { addUploadedFile, updateUploadProgress } = useFileUploadContext();
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
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            updateUploadProgress(file.name, percent);
          },
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      // Add to context state
      addUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
        url: urlData.publicUrl,
      });

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
    isUploading,
    error
  };
};
