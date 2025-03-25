
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/api';
import { formatErrorMessage } from '@/utils/error-handling';

interface UseApiResponseOptions<T> {
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
}

/**
 * Custom hook for handling API responses in a consistent way across the application
 * 
 * @param asyncFunction The async function that returns a Promise
 * @param dependencies Array of dependencies that should trigger a refetch
 * @param options Configuration options
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useApiResponse<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseApiResponseOptions<T> = {}
) {
  const {
    initialData = null,
    onSuccess,
    onError,
    showSuccessToast = false,
    successMessage = 'Operation completed successfully',
    showErrorToast = true,
    errorMessage
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (err) {
      const formattedError = err instanceof Error ? err : new Error(
        errorMessage || formatErrorMessage(err)
      );
      
      setError(formattedError);
      
      if (onError) {
        onError(formattedError);
      }
      
      if (showErrorToast) {
        toast.error("Error", {
          description: formattedError.message,
          duration: 5000
        });
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = () => fetchData();

  return {
    data,
    isLoading,
    error,
    refetch
  };
}

/**
 * Creates a standardized API response object
 * 
 * @param data The data to include in the response
 * @param error Optional error to include
 * @returns A standardized API response object
 */
export function createApiResponse<T>(
  data: T | null, 
  error: Error | null = null
): ApiResponse<T> {
  return { data, error };
}
