
// Define the basic types for file uploads
export interface FileItem {
  id: string;
  file: File;
  progress: number;
  error?: string;
  url?: string;
}

export interface FileState {
  identity: FileItem[];
  business: FileItem[];
  additional: FileItem[];
  [key: string]: FileItem[];
}

export interface UploadProgressItem {
  fileName: string;
  progress: number;
}

// More specific types for different upload contexts
export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

export interface FileUploadHook {
  files: FileState;
  uploadProgress: Record<string, UploadProgressItem>;
  uploadError: string | null;
  uploading: boolean;
  handleFileChange: (fileType: keyof FileState, e: React.ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
  updateProgress: (key: string, name: string, progress: number) => void;
  resetProgress: (key?: string) => void;
  resetFileUpload: () => void;
  uploadFiles: (businessId: string) => Promise<boolean>;
}
