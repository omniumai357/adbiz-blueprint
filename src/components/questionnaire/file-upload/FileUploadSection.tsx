
import { FC } from "react";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import LogoUpload from "./LogoUpload";
import FileUploadCategory from "@/features/file-upload/components/FileUploadCategory";
import UploadTips from "./UploadTips";
import { useFileUploadContext } from "@/contexts/file-upload-context";
import { FileState } from "@/features/file-upload/types";
import { fileAdapter } from "@/utils/file-adapter";

interface FileUploadSectionProps {
  hasLogo: boolean;
}

const FileUploadSection: FC<FileUploadSectionProps> = ({ hasLogo }) => {
  const { 
    files, 
    handleFileChange, 
    uploadProgress, 
    uploadError 
  } = useFileUploadContext();

  // Adapt FileState to be used with UI components expecting File objects
  const adaptedFiles = fileAdapter.adaptFileStateForUI(files);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof FileState) => {
    if (!e.target.files || e.target.files.length === 0) return;
    handleFileChange(fileType, e);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Upload Your Business Assets
      </h3>
      
      <p className="text-muted-foreground">
        Please upload files that will help us better understand your business and create effective marketing materials.
        All files should be high quality and represent your business professionally.
      </p>
      
      {uploadError && (
        <FormValidationMessage message={uploadError} />
      )}
      
      {/* Logo Upload */}
      {hasLogo && (
        <LogoUpload 
          logo={adaptedFiles.logo}
          onFileChange={onFileChange}
        />
      )}
      
      {/* Images Upload */}
      <FileUploadCategory
        title="Business Photos"
        description="Upload photos of your business, team, services, or products (JPG, PNG, GIF, WEBP formats)"
        fileType="images"
        files={adaptedFiles.images}
        acceptFormats=".jpg,.jpeg,.png,.gif,.webp"
        onFileChange={onFileChange}
      />
      
      {/* Videos Upload */}
      <FileUploadCategory
        title="Video Content"
        description="Upload any video content you'd like to include (MP4, MOV, WEBM formats)"
        fileType="videos"
        files={adaptedFiles.videos}
        acceptFormats=".mp4,.mov,.webm"
        onFileChange={onFileChange}
      />
      
      {/* Documents Upload */}
      <FileUploadCategory
        title="Business Documents"
        description="Upload any business documents that might be helpful (PDF, DOC, DOCX formats)"
        fileType="documents"
        files={adaptedFiles.documents}
        acceptFormats=".pdf,.doc,.docx"
        onFileChange={onFileChange}
      />
      
      <UploadTips />
    </div>
  );
};

export default FileUploadSection;
