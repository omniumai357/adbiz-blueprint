
import { FileItem, FileState } from "@/features/file-upload/types";
import { useFileUploadContext } from "@/contexts/file-upload-context";
import { useFileUploadService } from "@/hooks/file-upload/useFileUploadService";
import { fileAdapter } from "@/utils/file-adapter";
import { generateUniqueId } from "@/utils/id-generator";
import { logger } from '@/utils/logger';

export function useQuestionnaireFileUpload() {
  const { files, uploading } = useFileUploadContext();
  const { uploadFile, isUploading } = useFileUploadService();
  
  logger.debug('Initializing questionnaire file upload handler', {
    context: 'QuestionnaireUpload',
    data: {
      fileTypes: Object.keys(files),
      isUploading: uploading
    }
  });

  const uploadFiles = async (businessId: string) => {
    let filesUploaded = true;
    
    try {
      if (files.logo) {
        const logoUrl = await uploadFile(files.logo, `${businessId}/logo`);
        if (!logoUrl) filesUploaded = false;
      }
      
      if (Array.isArray(files.images)) {
        for (const fileItem of files.images as FileItem[]) {
          const imageUrl = await uploadFile(fileItem.file, `${businessId}/images`);
          if (!imageUrl) filesUploaded = false;
        }
      }
      
      if (Array.isArray(files.videos)) {
        for (const fileItem of files.videos as FileItem[]) {
          const videoUrl = await uploadFile(fileItem.file, `${businessId}/videos`);
          if (!videoUrl) filesUploaded = false;
        }
      }
      
      if (Array.isArray(files.documents)) {
        for (const fileItem of files.documents as FileItem[]) {
          const docUrl = await uploadFile(fileItem.file, `${businessId}/documents`);
          if (!docUrl) filesUploaded = false;
        }
      }
    } catch (error) {
      logger.error("Error uploading files:", { 
        context: 'QuestionnaireUpload',
        data: { 
          error: error instanceof Error ? error.message : String(error)
        }
      });
      filesUploaded = false;
    }
    
    return filesUploaded;
  };

  const prepareFilesForSubmission = () => {
    const fileState: FileState = {
      identity: [],
      business: [],
      additional: [],
      logo: files.logo,
      images: files.images as FileItem[],
      videos: files.videos as FileItem[],
      documents: files.documents as FileItem[]
    };
    
    const adaptedFiles = fileAdapter.adaptFileStateForUI(fileState);
    return fileAdapter.adaptUIFilesToFileState(adaptedFiles);
  };

  return {
    files,
    uploading,
    isUploading,
    uploadFiles,
    prepareFilesForSubmission,
    generateBusinessId: () => generateUniqueId('business')
  };
}
