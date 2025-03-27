
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { FileState, UploadProgressItem } from '../types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { formatFileSize } from '../utils';

interface FilePreviewProps {
  files: File[];
  fileType: keyof FileState;
  onRemove: (index: number) => void;
  progress?: Record<string, UploadProgressItem>;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  files,
  fileType,
  onRemove,
  progress = {},
  className = '',
}) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className={`mt-4 ${className}`}>
      <h5 className="text-sm font-medium mb-2">Selected Files ({files.length})</h5>
      <div className="space-y-2">
        {files.map((file, index) => {
          // Find progress for this file if available
          const fileProgress = Object.values(progress).find(p => p.fileName === file.name);
          
          return (
            <div 
              key={`${fileType}-${index}-${file.name}`}
              className="flex items-center gap-2 bg-secondary p-3 rounded-md"
            >
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="text-sm font-medium truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                </div>
                
                {fileProgress && (
                  <Progress 
                    value={fileProgress.progress} 
                    className="h-1 mt-2" 
                  />
                )}
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
