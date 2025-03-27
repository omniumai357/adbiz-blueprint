
import { FC } from "react";
import { FileState } from "@/features/file-upload/types";
import FileItem from "./FileItem";
import { useFileUploadContext } from "@/contexts/file-upload-context";
import { fileAdapter } from "@/utils/file-adapter";

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
  const fileTypeString = fileAdapter.fileTypeToString(fileType);

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
            key={`${fileTypeString}-${index}-${file.name}`}
            file={file}
            fileType={fileTypeString}
            index={index}
            onRemove={() => onRemoveFile(fileType, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilePreviewGrid;
