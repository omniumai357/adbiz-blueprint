
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, Image, Video } from "lucide-react";
import { formatFileSize } from "@/utils/file-validation";

interface FileItemProps {
  file: File;
  fileType: string;
  index: number;
  onRemove: () => void;
}

const FileItem: FC<FileItemProps> = ({ file, fileType, index, onRemove }) => {
  // Choose icon based on file type
  const FileIcon = () => {
    switch (fileType) {
      case 'images':
        return <Image className="h-4 w-4 text-primary" />;
      case 'videos':
        return <Video className="h-4 w-4 text-primary" />;
      case 'documents':
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="flex items-center gap-2 bg-secondary p-3 rounded-md shadow-sm transition-colors hover:bg-secondary/80">
      <FileIcon />
      <div className="flex flex-col flex-grow min-w-0">
        <span className="text-sm font-medium truncate">{file.name}</span>
        <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 rounded-full ml-auto"
        onClick={onRemove}
        aria-label="Remove file"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FileItem;
