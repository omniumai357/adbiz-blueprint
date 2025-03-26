
import { FC } from "react";
import { FileState } from "../types";
import FileItem from "./FileItem";
import { useFileUploadContext } from "@/contexts/file-upload-context";

interface FilePreviewGridProps {
  files: File[];
  fileType: keyof FileState;
  emptyMessage?: string;
  className?: string;
}

const FilePreviewGrid: FC<FilePreviewGridProps> = ({ 
  files, 
  fileType,
  emptyMessage = "No files uploaded yet",
  className = ""
}) => {
  const { onRemoveFile } = useFileUploadContext();

  if (files.length === 0) {
    return (
      <div className="mt-4 text-center py-6 bg-secondary/50 rounded-md">
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`mt-4 ${className}`}>
      <h5 className="text-sm font-medium mb-2">Uploaded Files ({files.length})</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {files.map((file, index) => (
          <FileItem 
            key={`${fileType}-${index}-${file.name}`}
            file={file}
            fileType={fileType}
            index={index}
            onRemove={() => onRemoveFile(fileType, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilePreviewGrid;
