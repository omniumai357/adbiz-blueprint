
// Utility functions for file uploads
import { supabase } from '@/integrations/supabase/client';

// Generate a file path for upload
export const generateFilePath = (
  businessId: string,
  fileType: string,
  file: File,
  index?: number
): string => {
  const fileExt = file.name.split('.').pop();
  
  if (fileType === 'logo') {
    return `${businessId}/logo.${fileExt}`;
  }
  
  const fileName = index !== undefined 
    ? `${Date.now()}-${index}.${fileExt}` 
    : `${Date.now()}.${fileExt}`;
    
  return `${businessId}/${fileType}/${fileName}`;
};

// Get a public URL for a file
export const getFileUrl = (bucket: string, filePath: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};
