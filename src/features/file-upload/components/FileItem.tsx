
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, Image, Video, File } from "lucide-react";
import { formatFileSize } from "@/utils/file-validation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileState } from "../types";

interface FileItemProps {
  file: File;
  fileType: keyof FileState;
  index: number;
  onRemove: () => void;
  className?: string;
  showPreview?: boolean;
}

const FileItem: FC<FileItemProps> = ({ 
  file, 
  fileType, 
  index, 
  onRemove, 
  className = "",
  showPreview = false
}) => {
  // Choose icon based on file type
  const FileIcon = () => {
    switch (fileType) {
      case 'images':
        return <Image className="h-4 w-4 text-primary" aria-hidden="true" />;
      case 'videos':
        return <Video className="h-4 w-4 text-primary" aria-hidden="true" />;
      case 'documents':
        return <FileText className="h-4 w-4 text-primary" aria-hidden="true" />;
      default:
        return <File className="h-4 w-4 text-primary" aria-hidden="true" />;
    }
  };

  // Generate image preview URL if showing previews for images
  const previewUrl = showPreview && fileType === 'images' && file.type.startsWith('image/') 
    ? URL.createObjectURL(file) 
    : null;

  return (
    <div 
      className={cn(
        "flex items-center gap-2 bg-secondary p-3 rounded-md shadow-sm transition-colors hover:bg-secondary/80",
        className
      )}
    >
      {previewUrl ? (
        <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-10 w-10 bg-primary/10 rounded flex-shrink-0">
          <FileIcon />
        </div>
      )}
      
      <div className="flex flex-col flex-grow min-w-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm font-medium truncate">{file.name}</span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{file.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 rounded-full ml-auto"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FileItem;
