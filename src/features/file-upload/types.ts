
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
