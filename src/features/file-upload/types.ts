
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

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Complete file upload hook interface
export interface FileUploadHook {
  files: FileState;
  uploadProgress: Record<string, UploadProgressItem>;
  uploadError: string | null;
  uploading: boolean;
  hasError: boolean;
  isUploading: boolean;
  handleFileChange: (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
  uploadFiles: (businessId: string) => Promise<boolean>;
  resetFileUpload: () => void;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  uploadFile: (file: File, path: string) => Promise<string>;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
}
