
/**
 * Utility functions for file uploads
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Upload a single file to Supabase storage
 */
export const uploadSingleFile = async (
  bucket: string,
  filePath: string,
  file: File,
  options?: {
    cacheControl?: string;
    onProgress?: (progress: number) => void;
  }
): Promise<{ success: boolean; error?: Error }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: options?.cacheControl || '3600',
      });
      
    if (error) throw error;
    
    // If we have a progress callback, call it with 100% when done
    if (options?.onProgress) {
      options.onProgress(100);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error as Error };
  }
};

/**
 * Generate a file path for upload
 */
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
