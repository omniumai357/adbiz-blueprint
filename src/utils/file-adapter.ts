
import { FileItem, FileState } from "@/features/file-upload/types";
import { logger } from "./logger";

/**
 * Adapter to convert between FileState (with FileItems) and UI components that expect regular Files
 */
export const fileAdapter = {
  /**
   * Extract actual File objects from FileItem objects
   * @param fileItems Array of FileItem objects or undefined
   * @returns Array of File objects
   */
  getFilesFromFileItems(fileItems: FileItem[] | undefined): File[] {
    try {
      if (!fileItems || !Array.isArray(fileItems)) return [];
      return fileItems.map(item => item.file);
    } catch (error) {
      logger.error("Error extracting files from FileItems:", error);
      return [];
    }
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
    try {
      return {
        logo: fileState.logo,
        images: Array.isArray(fileState.images) 
          ? this.getFilesFromFileItems(fileState.images)
          : [],
        videos: Array.isArray(fileState.videos) 
          ? this.getFilesFromFileItems(fileState.videos)
          : [],
        documents: Array.isArray(fileState.documents) 
          ? this.getFilesFromFileItems(fileState.documents)
          : []
      };
    } catch (error) {
      logger.error("Error adapting file state for UI:", error);
      // Return empty state if there's an error
      return {
        logo: null,
        images: [],
        videos: [],
        documents: []
      };
    }
  },

  /**
   * Safely convert keyof FileState to string
   */
  fileTypeToString(fileType: keyof FileState): string {
    return String(fileType);
  }
};
