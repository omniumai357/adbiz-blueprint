
import { FileState, FileItem } from '@/features/file-upload/types';
import { createFileItem, createFileItems } from '@/features/file-upload/utils';
import { logger } from '@/utils/logger';

/**
 * File Adapter Utilities
 * 
 * Helper functions for adapting between different file representations
 */
export const fileAdapter = {
  /**
   * Convert FileState to a UI-friendly format with File objects
   */
  adaptFileStateForUI: (fileState: FileState): Record<string, File | File[] | null> => {
    const result: Record<string, File | File[] | null> = {};
    
    logger.debug('Adapting FileState to UI format', {
      hasLogo: !!fileState.logo,
      fieldsPresent: Object.keys(fileState)
    });
    
    // Handle logo (special case - single File)
    if ('logo' in fileState) {
      result.logo = fileState.logo;
    }
    
    // Convert FileItem arrays to File arrays
    Object.entries(fileState).forEach(([key, value]) => {
      if (key !== 'logo' && Array.isArray(value)) {
        if (value.length > 0 && value[0] && typeof value[0] === 'object' && 'file' in value[0]) {
          // Handle FileItem[] arrays
          result[key] = (value as FileItem[]).map(item => item.file);
        } else {
          // Handle direct File[] arrays
          result[key] = value as unknown as File[];
        }
      }
    });
    
    return result;
  },
  
  /**
   * Convert UI files back to FileState format
   */
  adaptUIFilesToFileState: (uiFiles: Record<string, File | File[] | null>): FileState => {
    const result: Partial<FileState> = {
      identity: [],
      business: [],
      additional: [],
      logo: null,
      images: [],
      videos: [],
      documents: []
    };
    
    logger.debug('Adapting UI files to FileState', {
      fieldsPresent: Object.keys(uiFiles)
    });
    
    // Handle logo (special case - single File)
    if ('logo' in uiFiles) {
      result.logo = uiFiles.logo as File | null;
    }
    
    // Convert File arrays to FileItem arrays
    Object.entries(uiFiles).forEach(([key, value]) => {
      if (key !== 'logo' && Array.isArray(value)) {
        // Convert File[] to FileItem[]
        result[key] = createFileItems(value as File[]);
      }
    });
    
    return result as FileState;
  },
  
  /**
   * Create FileItems from a File array
   */
  createFileItems,
  
  /**
   * Create a single FileItem from a File
   */
  createFileItem,
  
  /**
   * Convert a keyof FileState to a string safely
   */
  fileTypeToString: (fileType: keyof FileState): string => {
    return String(fileType);
  }
};
