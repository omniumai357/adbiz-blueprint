
import { FileState, FileItem } from "@/features/file-upload/types";

/**
 * File adapter utility to convert between different file representations
 * and provide consistent file handling across the application.
 */
export const fileAdapter = {
  /**
   * Convert a FileState object to a UI-friendly format with plain File objects
   */
  adaptFileStateForUI(fileState: FileState): {
    logo: File | null;
    images: File[];
    videos: File[];
    documents: File[];
    identity: File[];
    business: File[];
    additional: File[];
  } {
    return {
      logo: fileState.logo ? fileState.logo : null,
      images: this.extractFilesFromItems(fileState.images),
      videos: this.extractFilesFromItems(fileState.videos),
      documents: this.extractFilesFromItems(fileState.documents),
      identity: this.extractFilesFromItems(fileState.identity),
      business: this.extractFilesFromItems(fileState.business),
      additional: this.extractFilesFromItems(fileState.additional),
    };
  },

  /**
   * Convert UI files back to FileState format
   */
  adaptUIFilesToFileState(files: {
    logo?: File | null;
    images?: File[];
    videos?: File[];
    documents?: File[];
    identity?: File[];
    business?: File[];
    additional?: File[];
  }): FileState {
    return {
      logo: files.logo || null,
      images: this.createFileItems(files.images || []),
      videos: this.createFileItems(files.videos || []),
      documents: this.createFileItems(files.documents || []),
      identity: this.createFileItems(files.identity || []),
      business: this.createFileItems(files.business || []),
      additional: this.createFileItems(files.additional || []),
    };
  },

  /**
   * Create FileItem objects from File objects
   */
  createFileItems(files: File[]): FileItem[] {
    return files.map(file => ({
      id: crypto.randomUUID(),
      file,
      status: 'ready',
      progress: 0,
    }));
  },

  /**
   * Extract File objects from FileItem objects
   */
  extractFilesFromItems(items: FileItem[] | any[]): File[] {
    if (!items || !Array.isArray(items)) return [];
    return items
      .filter(item => item && item.file instanceof File)
      .map(item => item.file);
  },

  /**
   * Convert file type key to human-readable string
   */
  fileTypeToString(fileType: string): string {
    const typeMapping: Record<string, string> = {
      logo: 'Logo',
      images: 'Images',
      videos: 'Videos',
      documents: 'Documents',
      identity: 'Identity Documents',
      business: 'Business Documents',
      additional: 'Additional Files',
    };
    
    return typeMapping[fileType] || fileType;
  }
};
