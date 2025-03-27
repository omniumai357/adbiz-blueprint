
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  formatErrorMessage, 
  logError, 
  ValidationError, 
  APIError 
} from '@/utils/error-handling';

/**
 * Simplified hook for error handling at the component level
 * 
 * Provides a standardized way to:
 * - Handle async operations with proper error handling
 * - Display error messages to users
 * - Manage loading states
 * - Track validation errors
 */
export function useAppError() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  /**
   * Clear all error states
   */
  const clearErrors = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);
  
  /**
   * Handle an error with consistent formatting
   */
  const handleError = useCallback((err: unknown, context?: string) => {
    logError(err, context);
    
    const errorMessage = formatErrorMessage(err);
    setError(err instanceof Error ? err : new Error(errorMessage));
    
    // Display toast notification
    toast.error("Error", {
      description: errorMessage,
      duration: 5000
    });
    
    // Handle validation errors
    if (err instanceof ValidationError && err.fieldErrors) {
      setFieldErrors(err.fieldErrors);
    }
  }, []);
  
  /**
   * Run an async operation with proper error handling and loading state
   */
  const runAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    options: {
      context?: string;
      successMessage?: string;
      loadingMessage?: string;
      onSuccess?: (result: T) => void;
    } = {}
  ): Promise<T | null> => {
    const { 
      context = 'operation', 
      successMessage, 
      loadingMessage,
      onSuccess 
    } = options;
    
    clearErrors();
    setIsLoading(true);
    
    if (loadingMessage) {
      toast.loading(loadingMessage);
    }
    
    try {
      const result = await operation();
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      handleError(err, context);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clearErrors, handleError]);
  
  /**
   * Check if a field has validation errors
   */
  const hasFieldError = useCallback((fieldName: string): boolean => {
    return Object.keys(fieldErrors).includes(fieldName);
  }, [fieldErrors]);
  
  /**
   * Get the error message for a field
   */
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return fieldErrors[fieldName];
  }, [fieldErrors]);
  
  /**
   * Convert API errors to app-specific errors
   */
  const handleAPIError = useCallback((err: unknown): Error => {
    if (err instanceof Error) return err;
    
    if (typeof err === 'object' && err !== null) {
      const apiErr = err as any;
      // Handle structured API errors
      if (apiErr.message) {
        if (apiErr.status && apiErr.status >= 400) {
          return new APIError(apiErr.message, apiErr.status, '');
        }
        return new Error(apiErr.message);
      }
    }
    
    return new Error('An unknown error occurred');
  }, []);
  
  return {
    isLoading,
    error,
    fieldErrors,
    clearErrors,
    handleError,
    runAsync,
    hasFieldError,
    getFieldError,
    handleAPIError
  };
}
