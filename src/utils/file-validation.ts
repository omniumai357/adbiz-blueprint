
import { FileState } from '@/features/file-upload/types';

/**
 * Get human-readable formats for a file type
 * @param fileType The type of file to get formats for
 * @returns A string with human-readable formats
 */
export function getReadableFileFormats(fileType: keyof FileState): string {
  const formats: Record<string, string> = {
    logo: 'JPG, PNG, SVG',
    images: 'JPG, PNG, GIF, WEBP',
    videos: 'MP4, MOV, WEBM',
    documents: 'PDF, DOC, DOCX',
    identity: 'JPG, PNG, PDF',
    business: 'JPG, PNG, PDF',
    additional: 'JPG, PNG, PDF'
  };

  return formats[fileType as string] || 'Various formats';
}

/**
 * Format file size into human-readable string
 * @param bytes The file size in bytes
 * @returns A formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

/**
 * Get allowed MIME types for a file type
 * @param fileType The type of file to get allowed MIME types for
 * @returns An array of allowed MIME types
 */
export function getAllowedFileTypes(fileType: keyof FileState): string[] {
  const typeMap: Record<string, string[]> = {
    logo: ['image/jpeg', 'image/png', 'image/svg+xml'],
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    videos: ['video/mp4', 'video/quicktime', 'video/webm'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    identity: ['image/jpeg', 'image/png', 'application/pdf'],
    business: ['image/jpeg', 'image/png', 'application/pdf'],
    additional: ['image/jpeg', 'image/png', 'application/pdf']
  };

  return typeMap[fileType as string] || [];
}
