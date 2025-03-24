
import { ChangeEvent, FC } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { FileState } from "@/hooks/useFileUpload";
import FileItem from "./FileItem";

interface FileUploadCategoryProps {
  title: string;
  description: string;
  fileType: keyof FileState;
  files: File[];
  acceptFormats: string;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, fileType: keyof FileState) => void;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
}

const FileUploadCategory: FC<FileUploadCategoryProps> = ({
  title,
  description,
  fileType,
  files,
  acceptFormats,
  onFileChange,
  onRemoveFile,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">{title}</Label>
        <p className="text-sm text-muted-foreground mb-2">
          {description}
        </p>
        
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="relative"
            onClick={() => document.getElementById(`${fileType}-upload`)?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Select {title}
            <input
              id={`${fileType}-upload`}
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
        
        {files.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map((file, index) => (
              <FileItem 
                key={`${fileType}-${index}`}
                file={file}
                fileType={fileType}
                index={index}
                onRemove={() => onRemoveFile(fileType, index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadCategory;
