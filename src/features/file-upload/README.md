# File Upload Feature

This directory contains the file upload functionality for the application. It follows a feature-based organization pattern to encapsulate all file upload related components, hooks, and utilities.

## Structure

- `/components` - React components related to file uploads
- `/hooks` - Custom hooks for file upload operations
- `/types.ts` - TypeScript types for file upload related data
- `/utils.ts` - Utility functions for file uploads

## Usage

### Basic File Upload

To implement basic file uploads:

```tsx
import { useFileUpload } from "@/features/file-upload";

function MyComponent() {
  const { 
    files,
    handleFileChange,
    onRemoveFile,
    uploadFiles,
    uploading
  } = useFileUpload();
  
  // Use file upload state and methods
}
```

### File Upload Context

For more complex scenarios, use the FileUploadProvider:

```tsx
import { FileUploadProvider } from "@/contexts/file-upload-context";

function App() {
  return (
    <FileUploadProvider>
      {/* Your app components */}
    </FileUploadProvider>
  );
}
```

### Components

Ready-to-use file upload components:

```tsx
import { FileUploadField, FilePreview } from "@/features/file-upload";

function UploadForm() {
  return (
    <div>
      <FileUploadField 
        fileType="images" 
        label="Upload Images" 
      />
      <FilePreview fileType="images" />
    </div>
  );
}
```

## File State Pattern

The file upload system uses a standardized `FileState` type:

```ts
interface FileState {
  logo: File | null;
  images: FileItem[];
  videos: FileItem[];
  documents: FileItem[];
  // ... other file types
}
```

This allows for consistent handling of different file types.

## Refactoring Notes

This feature module has been refactored to improve:

1. **Organization** - All file upload related code is now in a single feature directory
2. **Documentation** - Comprehensive JSDoc comments and README
3. **Type Safety** - Strong TypeScript types for all file upload operations
4. **Backward Compatibility** - Legacy imports still work via re-exports

The refactoring focused on maintaining the exact same functionality while improving the code structure and readability.
