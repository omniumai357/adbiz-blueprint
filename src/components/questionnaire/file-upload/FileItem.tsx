
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, Image, Video } from "lucide-react";

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
    <div className="flex items-center gap-2 bg-secondary p-2 rounded-md">
      <FileIcon />
      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 rounded-full ml-auto"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FileItem;
