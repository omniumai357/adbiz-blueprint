
import { FC } from "react";
import { FileState } from "@/hooks/useFileUpload";
import FileItem from "./FileItem";

interface FilePreviewGridProps {
  files: File[];
  fileType: keyof FileState;
  onRemoveFile: (fileType: keyof FileState, index?: number) => void;
}

const FilePreviewGrid: FC<FilePreviewGridProps> = ({ 
  files, 
  fileType, 
  onRemoveFile 
}) => {
  return (
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
  );
};

export default FilePreviewGrid;
