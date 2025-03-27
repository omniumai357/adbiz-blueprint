
import { FC } from "react";
import { FileState } from "@/features/file-upload/types";
import { FileUploadCategory as FeatureFileUploadCategory } from "@/features/file-upload/components/FileUploadCategory";

interface FileUploadCategoryProps {
  title: string;
  description: string;
  fileType: keyof FileState;
  files: File[];
  acceptFormats: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof FileState) => void;
}

/**
 * This is a compatibility wrapper around the feature-based FileUploadCategory
 * It maintains the same API for existing components to avoid breaking changes
 */
const FileUploadCategory: FC<FileUploadCategoryProps> = (props) => {
  return <FeatureFileUploadCategory {...props} />;
};

export default FileUploadCategory;
