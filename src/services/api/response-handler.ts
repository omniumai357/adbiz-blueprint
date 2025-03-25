
import { toast } from 'sonner';
import { formatErrorMessage, logError, APIError } from '@/utils/error-handling';
import { ApiResponse } from '@/types/api';

/**
 * Standardized API response handler that provides consistent error handling
 * and data transformation for all API client methods.
 */
export const apiResponseHandler = {
  /**
   * Handle the response from an API call
   * 
   * @param responsePromise Promise returned by API call
   * @param options Configuration options
   * @returns Promise with transformed data or throws a standardized error
   */
  async handle<T>(
    responsePromise: Promise<any>,
    options: {
      context?: string;
      transform?: (data: any) => T;
      showErrorToast?: boolean;
      showSuccessToast?: boolean;
      successMessage?: string;
    } = {}
  ): Promise<T> {
    const {
      context = 'API Request',
      transform = (data) => data as T,
      showErrorToast = true,
      showSuccessToast = false,
      successMessage
    } = options;

    try {
      // Wait for the response
      const response = await responsePromise;
      
      // Transform the response data
      const transformedData = transform(response);
      
      // Show success toast if requested
      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }
      
      return transformedData;
    } catch (error) {
      // Log the error with context
      logError(error, context);
      
      // Format the error message
      const errorMessage = formatErrorMessage(error);
      
      // Show error toast if requested
      if (showErrorToast) {
        toast.error("Error", {
          description: errorMessage,
          duration: 5000
        });
      }
      
      // Rethrow as standardized API error
      throw error instanceof Error 
        ? error 
        : new APIError(errorMessage);
    }
  },
  
  /**
   * Create a standardized API response object
   * 
   * @param data The data to include in the response
   * @param error Optional error to include in the response
   * @returns A standardized API response object
   */
  createResponse<T>(data: T | null, error: Error | null = null): ApiResponse<T> {
    return { data, error };
  }
};
