
import { ChangeEvent, FC } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import { Upload, X, FileText, Image, Video } from "lucide-react";
import { FileState } from "@/hooks/useFileUpload";

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
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Business Logo</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Upload your current logo (JPG, PNG, or SVG format)
            </p>
            
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="relative"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Logo
                <input
                  id="logo-upload"
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={(e) => handleFileChange(e, 'logo')}
                />
              </Button>
              
              {files.logo && (
                <div className="flex items-center gap-2 bg-secondary p-2 rounded-md">
                  <Image className="h-4 w-4 text-primary" />
                  <span className="text-sm truncate max-w-[200px]">{files.logo.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => onRemoveFile('logo')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Images Upload */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Business Photos</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Upload photos of your business, team, services, or products (JPG, PNG, GIF, WEBP formats)
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="relative"
              onClick={() => document.getElementById('images-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Images
              <input
                id="images-upload"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                multiple
                onChange={(e) => handleFileChange(e, 'images')}
              />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {files.images.length} file(s) selected
            </span>
          </div>
          
          {files.images.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {files.images.map((file, index) => (
                <div 
                  key={`image-${index}`} 
                  className="flex items-center gap-2 bg-secondary p-2 rounded-md"
                >
                  <Image className="h-4 w-4 text-primary" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full ml-auto"
                    onClick={() => onRemoveFile('images', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Videos Upload */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Video Content</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Upload any video content you'd like to include (MP4, MOV, WEBM formats)
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="relative"
              onClick={() => document.getElementById('videos-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Videos
              <input
                id="videos-upload"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".mp4,.mov,.webm"
                multiple
                onChange={(e) => handleFileChange(e, 'videos')}
              />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {files.videos.length} file(s) selected
            </span>
          </div>
          
          {files.videos.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {files.videos.map((file, index) => (
                <div 
                  key={`video-${index}`} 
                  className="flex items-center gap-2 bg-secondary p-2 rounded-md"
                >
                  <Video className="h-4 w-4 text-primary" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full ml-auto"
                    onClick={() => onRemoveFile('videos', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Documents Upload */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Business Documents</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Upload any business documents that might be helpful (PDF, DOC, DOCX formats)
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="relative"
              onClick={() => document.getElementById('documents-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Documents
              <input
                id="documents-upload"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={(e) => handleFileChange(e, 'documents')}
              />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {files.documents.length} file(s) selected
            </span>
          </div>
          
          {files.documents.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {files.documents.map((file, index) => (
                <div 
                  key={`document-${index}`} 
                  className="flex items-center gap-2 bg-secondary p-2 rounded-md"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full ml-auto"
                    onClick={() => onRemoveFile('documents', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-secondary/50 p-4 rounded-md mt-6">
        <h4 className="text-sm font-medium mb-2">Upload Tips:</h4>
        <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
          <li>Make sure all images are high resolution and properly lit</li>
          <li>Videos should be well recorded and showcase your services or products</li>
          <li>Include any existing marketing materials or brochures you may have</li>
          <li>If your file is too large, you can share a download link in the notes section</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadSection;
