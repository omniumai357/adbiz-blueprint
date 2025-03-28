
/**
 * File upload types for the application
 */

export type FileStatus = 'ready' | 'uploading' | 'uploaded' | 'error';

export interface FileItem {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
}

export interface FileState {
  logo?: File | null;
  images: FileItem[];
  videos: FileItem[];
  documents: FileItem[];
  identity?: FileItem[];
  business?: FileItem[];
  additional?: FileItem[];
}

export interface UploadProgressItem {
  fileId: string;
  progress: number;
  fileType: string;
  fileName: string;
  status: FileStatus;
}

export interface FileUploadOptions {
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  minFiles?: number;
  required?: boolean;
  name?: string;
  onProgress?: (progress: number) => void;
  onComplete?: (files: File[]) => void;
  onError?: (error: string) => void;
}

export interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  error?: string;
}
