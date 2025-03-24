
/**
 * Utility functions for file validation
 */

/**
 * Check if a file type is valid against a list of allowed types
 */
export const fileTypeIsValid = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Get allowed file types by category
 */
export const getAllowedFileTypes = (fileType: string): string[] => {
  const allowedTypes: Record<string, string[]> = {
    logo: ['image/jpeg', 'image/png', 'image/svg+xml'],
    images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    videos: ['video/mp4', 'video/quicktime', 'video/webm'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  };
  
  return allowedTypes[fileType] || [];
};

/**
 * Validate files against allowed types
 */
export const validateFiles = (
  files: File[], 
  fileType: string
): { validFiles: File[]; hasInvalidFiles: boolean } => {
  const allowedTypes = getAllowedFileTypes(fileType);
  
  const validFiles = files.filter(file => fileTypeIsValid(file, allowedTypes));
  const hasInvalidFiles = validFiles.length !== files.length;
  
  return { validFiles, hasInvalidFiles };
};
