
import { FileState, FileItem } from '@/features/file-upload/types';
import { logger } from '@/utils/logger';

/**
 * FileAdapter utility for converting between file storage formats
 * and handling file state conversions across the application.
 */
export const fileAdapter = {
  /**
   * Converts FileState objects with FileItem arrays to plain File objects
   * for use in UI components
   */
  adaptFileStateForUI(fileState: FileState) {
    logger.debug('Adapting file state for UI', {
      context: 'FileAdapter',
      data: {
        hasLogo: !!fileState.logo,
        imagesCount: Array.isArray(fileState.images) ? fileState.images.length : 0,
        videosCount: Array.isArray(fileState.videos) ? fileState.videos.length : 0,
        documentsCount: Array.isArray(fileState.documents) ? fileState.documents.length : 0
      }
    });
    
    // Convert logo (single file)
    const logo = fileState.logo || null;
    
    // Helper function to extract File from FileItem
    const extractFiles = (items: unknown): File[] => {
      if (!Array.isArray(items)) return [];
      
      return items.map(item => {
        // If item is already a File, return it
        if (item instanceof File) return item;
        
        // If item is a FileItem, extract the file property
        if (typeof item === 'object' && item !== null && 'file' in item) {
          return (item as FileItem).file;
        }
        
        // Otherwise return null, which will be filtered out
        return null;
      }).filter(Boolean) as File[];
    };
    
    // Adapted files object with plain File objects
    const adaptedFiles = {
      logo,
      images: extractFiles(fileState.images),
      videos: extractFiles(fileState.videos),
      documents: extractFiles(fileState.documents),
      identity: extractFiles(fileState.identity),
      business: extractFiles(fileState.business),
      additional: extractFiles(fileState.additional)
    };
    
    logger.debug('File state adapted', {
      context: 'FileAdapter',
      data: {
        fieldsPresent: Object.keys(adaptedFiles).filter(key => 
          adaptedFiles[key as keyof typeof adaptedFiles] !== null && 
          (
            adaptedFiles[key as keyof typeof adaptedFiles] instanceof File ||
            (Array.isArray(adaptedFiles[key as keyof typeof adaptedFiles]) && 
            (adaptedFiles[key as keyof typeof adaptedFiles] as any).length > 0)
          )
        )
      }
    });
    
    return adaptedFiles;
  },
  
  /**
   * Helper method to convert a file type to string representation
   */
  fileTypeToString(fileType: keyof FileState): string {
    return fileType.toString();
  },
  
  /**
   * Create FileItem objects from File objects
   */
  createFileItems(files: File[]): FileItem[] {
    return files.map(file => ({
      file,
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: false,
      uploadProgress: 0,
      progress: 0, // Add progress property to match FileItem interface
      error: null
    }));
  },
  
  /**
   * Converts UI file objects back to FileState format
   */
  adaptUIFilesToFileState(uiFiles: any): FileState {
    const fileState: FileState = {
      logo: uiFiles.logo || null,
      images: [],
      videos: [],
      documents: [],
      identity: [],
      business: [],
      additional: []
    };
    
    // Convert arrays of files to arrays of FileItems
    (Object.keys(uiFiles) as Array<keyof typeof uiFiles>).forEach(key => {
      if (key !== 'logo' && Array.isArray(uiFiles[key])) {
        fileState[key as keyof FileState] = this.createFileItems(uiFiles[key]);
      }
    });
    
    return fileState;
  }
};
