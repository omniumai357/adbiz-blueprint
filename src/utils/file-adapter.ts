
import { FileItem, FileState } from "@/features/file-upload/types";

/**
 * Adapter to convert between FileState (with FileItems) and UI components that expect regular Files
 */
export const fileAdapter = {
  /**
   * Extract actual File objects from FileItem objects
   * @param fileItems Array of FileItem objects
   * @returns Array of File objects
   */
  getFilesFromFileItems(fileItems: FileItem[]): File[] {
    return fileItems.map(item => item.file);
  },

  /**
   * Converts a FileState object to a format with plain File objects
   * that can be consumed by UI components
   */
  adaptFileStateForUI(fileState: FileState): {
    logo: File | null;
    images: File[];
    videos: File[];
    documents: File[];
  } {
    return {
      logo: fileState.logo,
      images: Array.isArray(fileState.images) 
        ? fileState.images.map(item => item.file) 
        : [],
      videos: Array.isArray(fileState.videos) 
        ? fileState.videos.map(item => item.file) 
        : [],
      documents: Array.isArray(fileState.documents) 
        ? fileState.documents.map(item => item.file) 
        : []
    };
  },

  /**
   * Converts a keyof FileState to a string to fix type errors when using it as props
   */
  fileTypeToString(fileType: keyof FileState): string {
    return fileType as string;
  }
};
