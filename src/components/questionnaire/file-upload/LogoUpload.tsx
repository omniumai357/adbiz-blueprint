
import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";
import { FileState } from "@/features/file-upload/types";
import { useFileValidation } from "@/features/file-upload/hooks/useFileValidation";
import { getReadableFileFormats } from "@/utils/file-validation";
import { useFileUploadContext } from "@/contexts/file-upload-context";
import { formatFileSize } from "@/features/file-upload/utils";

interface LogoUploadProps {
  logo: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof FileState) => void;
}

const LogoUpload: FC<LogoUploadProps> = ({ logo, onFileChange }) => {
  const { onRemoveFile } = useFileUploadContext();
  const { getMaxFileSize } = useFileValidation();
  const maxFileSize = getMaxFileSize('logo');
  const readableFormats = getReadableFileFormats('logo');
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Business Logo</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload your current logo in high resolution
        </p>
        
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="relative"
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={!!logo}
            >
              <Upload className="h-4 w-4 mr-2" />
              {logo ? 'Replace Logo' : 'Select Logo'}
              <input
                id="logo-upload"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".jpg,.jpeg,.png,.svg"
                onChange={(e) => onFileChange(e, 'logo')}
              />
            </Button>
            
            <div className="text-xs text-muted-foreground">
              Accepted formats: {readableFormats} • Max size: {formatFileSize(maxFileSize)}
            </div>
          </div>
          
          {logo && (
            <div className="flex items-center gap-2 bg-secondary p-3 rounded-md shadow-sm mt-2">
              <Image className="h-4 w-4 text-primary" />
              <div className="flex flex-col flex-grow min-w-0">
                <span className="text-sm font-medium truncate">{logo.name}</span>
                <span className="text-xs text-muted-foreground">{formatFileSize(logo.size)}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-full"
                onClick={() => onRemoveFile('logo')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;
