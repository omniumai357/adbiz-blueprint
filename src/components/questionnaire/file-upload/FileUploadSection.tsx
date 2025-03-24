
import { ChangeEvent, FC } from "react";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import { FileState } from "@/hooks/useFileUpload";
import LogoUpload from "./LogoUpload";
import FileUploadCategory from "./FileUploadCategory";
import UploadTips from "./UploadTips";

interface FileUploadSectionProps {
  files: FileState;
  onFileChange: (fileType: keyof FileState, e: ChangeEvent<HTMLInputElement> | readonly File[]) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
  uploadProgress: Record<string, { name: string; progress: number }>;
  uploadError: string | null;
  hasLogo: boolean;
}

const FileUploadSection: FC<FileUploadSectionProps> = ({
  files,
  onFileChange,
  onRemoveFile,
  uploadProgress,
  uploadError,
  hasLogo,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: keyof FileState) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Pass the event directly to onFileChange
    onFileChange(fileType, e);
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
          logo={files.logo}
          onFileChange={handleFileChange}
          onRemoveFile={onRemoveFile}
        />
      )}
      
      {/* Images Upload */}
      <FileUploadCategory
        title="Business Photos"
        description="Upload photos of your business, team, services, or products (JPG, PNG, GIF, WEBP formats)"
        fileType="images"
        files={files.images}
        acceptFormats=".jpg,.jpeg,.png,.gif,.webp"
        onFileChange={handleFileChange}
        onRemoveFile={onRemoveFile}
      />
      
      {/* Videos Upload */}
      <FileUploadCategory
        title="Video Content"
        description="Upload any video content you'd like to include (MP4, MOV, WEBM formats)"
        fileType="videos"
        files={files.videos}
        acceptFormats=".mp4,.mov,.webm"
        onFileChange={handleFileChange}
        onRemoveFile={onRemoveFile}
      />
      
      {/* Documents Upload */}
      <FileUploadCategory
        title="Business Documents"
        description="Upload any business documents that might be helpful (PDF, DOC, DOCX formats)"
        fileType="documents"
        files={files.documents}
        acceptFormats=".pdf,.doc,.docx"
        onFileChange={handleFileChange}
        onRemoveFile={onRemoveFile}
      />
      
      <UploadTips />
    </div>
  );
};

export default FileUploadSection;
