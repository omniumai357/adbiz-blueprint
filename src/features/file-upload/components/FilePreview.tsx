
import React from 'react';
import { X } from 'lucide-react';
import { useFileUploadContext } from '@/contexts/file-upload-context';
import { FileState } from '../types';

interface FilePreviewProps {
  fileType: keyof FileState;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  fileType,
  className = ""
}) => {
  const { files, onRemoveFile, uploadProgress } = useFileUploadContext();
  
  if (files[fileType].length === 0) {
    return null;
  }
  
  return (
    <div className={`mt-4 ${className}`}>
      <h4 className="text-sm font-medium mb-2">Selected Files</h4>
      <ul className="space-y-2">
        {files[fileType].map((file, index) => {
          const progress = uploadProgress[file.id]?.progress || 0;
          
          return (
            <li 
              key={file.id} 
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="text-sm truncate">{file.file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              
              {progress > 0 && progress < 100 ? (
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onRemoveFile(fileType, index)}
                  className="text-gray-500 hover:text-red-500"
                  aria-label={`Remove ${file.file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
