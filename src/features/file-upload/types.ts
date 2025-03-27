
/**
 * File Upload Types
 * 
 * Core types for the file upload feature
 */

// Basic file item interface
export interface FileItem {
  id: string;
  file: File;
  progress: number;
}

// File state management interface
export interface FileState {
  logo: File | null;
  identity: FileItem[];
  business: FileItem[];
  additional: FileItem[];
  images: FileItem[];
  videos: FileItem[];
  documents: FileItem[];
  [key: string]: FileItem[] | File | null;
}

// Upload progress tracking interface
export interface UploadProgressItem {
  fileName: string;
  progress: number;
}

// Upload result interface
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
