
import React from "react";
import { LoadingSpinner } from "./loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingContentProps {
  isLoading: boolean;
  error?: Error | null;
  loadingText?: string;
  errorText?: string;
  isEmpty?: boolean;
  emptyContent?: React.ReactNode;
  children: React.ReactNode;
  useSkeleton?: boolean;
  skeletonContent?: React.ReactNode;
}

export function LoadingContent({
  isLoading,
  error,
  loadingText = "Loading...",
  errorText = "An error occurred",
  isEmpty = false,
  emptyContent,
  children,
  useSkeleton = false,
  skeletonContent
}: LoadingContentProps) {
  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        <p>{errorText}</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    if (useSkeleton && skeletonContent) {
      return <>{skeletonContent}</>;
    }
    
    return (
      <div className="py-8">
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  if (isEmpty && emptyContent) {
    return <>{emptyContent}</>;
  }

  return <>{children}</>;
}
