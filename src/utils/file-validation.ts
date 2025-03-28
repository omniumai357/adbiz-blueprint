
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
