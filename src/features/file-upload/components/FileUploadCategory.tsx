
import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { FileState } from "../types";
import FilePreviewGrid from "./FilePreviewGrid";
import { getReadableFileFormats } from "@/utils/file-validation";
import { useFileValidation } from "../hooks/useFileValidation";
import { fileAdapter } from "@/utils/file-adapter";

interface FileUploadCategoryProps {
  title: string;
  description: string;
  fileType: keyof FileState;
  files: File[];
  acceptFormats: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof FileState) => void;
}

export const FileUploadCategory: FC<FileUploadCategoryProps> = ({
  title,
  description,
  fileType,
  files,
  acceptFormats,
  onFileChange,
}) => {
  const { formatFileSize, getMaxFileSize } = useFileValidation();
  
  // Safely convert fileType to string for display purposes using our adapter utility
  const fileTypeStr = fileAdapter.fileTypeToString(fileType);
  // Pass the fileType directly to getMaxFileSize and getReadableFileFormats since they expect a keyof FileState
  const maxFileSize = getMaxFileSize(fileType);
  const readableFormats = getReadableFileFormats(fileType);
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">{title}</Label>
        <p className="text-sm text-muted-foreground mb-2">
          {description}
        </p>
        
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="relative"
              onClick={() => document.getElementById(`${fileTypeStr}-upload`)?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select {title}
              <input
                id={`${fileTypeStr}-upload`}
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept={acceptFormats}
                multiple
                onChange={(e) => onFileChange(e, fileType)}
              />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {files.length} file(s) selected
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Accepted formats: {readableFormats} • Max size: {formatFileSize(maxFileSize)}
          </div>
        </div>
        
        {files.length > 0 && (
          <FilePreviewGrid
            files={files}
            fileType={fileType}
            emptyMessage={`No ${fileTypeStr} uploaded yet`}
          />
        )}
      </div>
    </div>
  );
};
