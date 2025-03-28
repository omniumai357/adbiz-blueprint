
import { FileState, FileItem } from '@/features/file-upload/types';

/**
 * Utility functions for adapting file types between different components
 */
export const fileAdapter = {
  /**
   * Convert FileState to UI-compatible format (plain File objects)
   */
  adaptFileStateForUI: (fileState: FileState): Record<string, File | File[]> => {
    const result: Record<string, File | File[]> = {};
    
    // Handle logo (single file)
    if (fileState.logo) {
      result.logo = fileState.logo;
    } else {
      result.logo = null;
    }
    
    // Handle array types by extracting File objects from FileItems
    const arrayProperties: Array<keyof FileState> = [
      'images', 'videos', 'documents', 'identity', 'business', 'additional'
    ];
    
    arrayProperties.forEach(prop => {
      if (Array.isArray(fileState[prop])) {
        const items = fileState[prop] as FileItem[];
        result[prop] = items.map(item => item.file);
      } else {
        result[prop] = [];
      }
    });
    
    return result;
  },
  
  /**
   * Convert UI format (plain File objects) back to FileState
   */
  adaptUIFilesToFileState: (uiFiles: Record<string, File | File[]>): FileState => {
    const result: FileState = {
      logo: null,
      images: [],
      videos: [],
      documents: [],
      identity: [],
      business: [],
      additional: []
    };
    
    // Handle logo (single file)
    if (uiFiles.logo) {
      result.logo = uiFiles.logo as File;
    }
    
    // Handle array types by converting File objects to FileItems
    const arrayProperties = ['images', 'videos', 'documents', 'identity', 'business', 'additional'];
    
    arrayProperties.forEach(prop => {
      if (Array.isArray(uiFiles[prop])) {
        const files = uiFiles[prop] as File[];
        
        result[prop as keyof FileState] = files.map(file => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          status: 'ready',
          progress: 0
        }));
      }
    });
    
    return result;
  },
  
  /**
   * Safely convert a keyof FileState to string for display or logging
   */
  fileTypeToString: (fileType: keyof FileState): string => {
    return String(fileType);
  }
};
