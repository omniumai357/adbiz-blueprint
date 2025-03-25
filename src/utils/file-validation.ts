
/**
 * Utility functions for file validation
 */

/**
 * Check if a file type is valid against a list of allowed types
 */
export const fileTypeIsValid = (file: File, allowedTypes: string[]): boolean => {
  // If no extension filtering is needed, allow all types
  if (allowedTypes.length === 0) return true;
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
 * Get readable format names for file types
 */
export const getReadableFileFormats = (fileType: string): string => {
  const formatMap: Record<string, string> = {
    logo: 'JPG, PNG, SVG',
    images: 'JPG, PNG, WebP, GIF',
    videos: 'MP4, MOV, WebM',
    documents: 'PDF, DOC, DOCX'
  };
  
  return formatMap[fileType] || '';
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
  
  if (hasInvalidFiles) {
    console.warn(`Invalid file types detected. Allowed types for ${fileType}: ${allowedTypes.join(', ')}`);
    console.warn('Rejected files:', files.filter(file => !validFiles.includes(file)).map(f => f.name));
  }
  
  return { validFiles, hasInvalidFiles };
};

/**
 * Check if a file exceeds maximum size
 */
export const isFileSizeValid = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
