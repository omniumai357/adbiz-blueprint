
import { ChangeEvent, FC } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";
import { FileState } from "@/hooks/useFileUpload";

interface LogoUploadProps {
  logo: File | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, fileType: keyof FileState) => void;
  onRemoveFile: (fileType: keyof FileState) => void;
}

const LogoUpload: FC<LogoUploadProps> = ({ logo, onFileChange, onRemoveFile }) => {
  return (
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
              onChange={(e) => onFileChange(e, 'logo')}
            />
          </Button>
          
          {logo && (
            <div className="flex items-center gap-2 bg-secondary p-2 rounded-md">
              <Image className="h-4 w-4 text-primary" />
              <span className="text-sm truncate max-w-[200px]">{logo.name}</span>
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
  );
};

export default LogoUpload;
