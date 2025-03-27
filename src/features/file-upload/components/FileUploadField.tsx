
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { getReadableFileFormats } from '@/utils/file-validation';
import { getMaxFileSize, formatFileSize } from '../utils';

interface FileUploadFieldProps {
  label: string;
  description?: string;
  fileType: string;
  acceptedFormats: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  description,
  fileType,
  acceptedFormats,
  onChange,
  disabled = false,
  className = '',
}) => {
  const maxFileSize = getMaxFileSize(fileType);
  const readableFormats = getReadableFileFormats(fileType);
  const inputId = `${fileType}-upload-input`;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={inputId} className="text-base font-medium">
        {label}
      </Label>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-2">
          {description}
        </p>
      )}
      
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          className="relative w-fit"
          onClick={() => !disabled && document.getElementById(inputId)?.click()}
          disabled={disabled}
        >
          <Upload className="h-4 w-4 mr-2" />
          Select Files
          <input
            id={inputId}
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept={acceptedFormats}
            onChange={onChange}
            disabled={disabled}
            multiple={fileType !== 'logo'}
          />
        </Button>
        
        <div className="text-xs text-muted-foreground">
          Accepted formats: {readableFormats} • Max size: {formatFileSize(maxFileSize)}
        </div>
      </div>
    </div>
  );
};
