
# File Upload Feature

This feature module provides a complete file upload system with hooks, components, types, and utilities for handling file uploads across the application.

## Structure

```
src/features/file-upload/
├── components/           # UI components for file uploads
├── hooks/                # React hooks for file upload state management
├── types.ts              # TypeScript type definitions
├── utils.ts              # Utility functions
└── index.ts              # Main entry point and exports
```

## Usage

### Basic Usage

```tsx
import { useFileUpload } from '@/features/file-upload/hooks';
import { FileUploadField } from '@/features/file-upload/components';

const MyComponent = () => {
  const { 
    files, 
    handleFileChange, 
    onRemoveFile, 
    uploadProgress,
    uploadError
  } = useFileUpload();
  
  return (
    <div>
      <FileUploadField
        label="Upload Documents"
        fileType="documents"
        acceptedFormats=".pdf,.doc,.docx"
        onChange={(e) => handleFileChange('documents', e)}
      />
      
      {/* Display file preview and upload progress */}
    </div>
  );
};
```

### With Context Provider

For larger applications, you can use the `FileUploadProvider` to make file upload functionality available globally:

```tsx
// In your App.tsx or a parent component
import { FileUploadProvider } from '@/contexts/file-upload-context';

const App = () => {
  return (
    <FileUploadProvider>
      {/* Your application components */}
    </FileUploadProvider>
  );
};

// In a child component
import { useFileUploadContext } from '@/contexts/file-upload-context';

const UploadComponent = () => {
  const { files, handleFileChange } = useFileUploadContext();
  
  // Use file upload functionality
};
```

## Components

| Component | Description |
|-----------|-------------|
| `FileUploadCategory` | Category-based file upload with preview |
| `FileUploadField` | Basic file upload input field |
| `FileItem` | Individual file item display |
| `FilePreview` | Preview of uploaded files |
| `FilePreviewGrid` | Grid layout for file previews |

## Hooks

| Hook | Description |
|------|-------------|
| `useFileUpload` | Main hook for file upload functionality |
| `useFileUploadState` | Hook for managing file state |
| `useFileUploadProgress` | Hook for tracking upload progress |
| `useFileValidation` | Hook for file validation |
| `useFileUploadHandlers` | Hook for file event handlers |

## Migration Guide

If you're migrating from the old file upload system:

1. Replace imports from `@/hooks/useFileUpload` with `@/features/file-upload/hooks`
2. Replace file component imports with components from `@/features/file-upload/components`
3. Update any type imports to use `@/features/file-upload/types`

For more complex migrations, see the compatibility layer in `src/hooks/file-upload/index.ts`.
