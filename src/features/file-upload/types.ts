
/**
 * FileState interface defines the structure for file upload state
 */
export interface FileState {
  logo: File | null;
  images: File[];
  videos: File[];
  documents: File[];
}

/**
 * UploadProgressItem interface for tracking individual file upload progress
 */
export interface UploadProgressItem {
  name: string;
  progress: number;
}

export interface FileUploadState {
  files: Record<string, File>;
  status: Record<string, string>;
  progress: Record<string, number>;
  errors: Record<string, string>;
  urls: Record<string, string>;
}

export interface FileUploadProps {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
  error?: string;
  url?: string;
  metadata?: Record<string, any>;
}
