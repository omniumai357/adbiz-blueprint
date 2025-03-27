
import React from 'react';
import { Upload } from 'lucide-react';
import { useFileUploadContext } from '@/contexts/file-upload-context';
import { FileState } from '../types';

interface FileUploadFieldProps {
  fileType: keyof FileState;
  label: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  fileType,
  label,
  accept = "image/*,.pdf,.doc,.docx",
  multiple = true,
  className = ""
}) => {
  const { handleFileChange, files } = useFileUploadContext();
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={`file-${fileType}`} className="text-sm font-medium">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-500">
            Drag & drop or click to select files
          </p>
          <p className="text-xs text-gray-400">
            {Array.isArray(files[fileType]) && (files[fileType] as any[]).length > 0 
              ? `${(files[fileType] as any[]).length} file(s) selected` 
              : 'No files selected'}
          </p>
          <input
            id={`file-${fileType}`}
            type="file"
            className="sr-only"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFileChange(fileType, e)}
          />
        </div>
      </div>
    </div>
  );
};
