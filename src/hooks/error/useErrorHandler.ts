
import { useCallback } from "react";
import { useErrorContext } from "@/contexts/error-context";
import { ValidationError } from "@/utils/error-handling";

/**
 * Hook for standardized error handling throughout the application
 */
export function useErrorHandler() {
  const {
    notifyError,
    clearError,
    validationErrors,
    setValidationErrors,
    clearValidationErrors,
    isLoading,
    setIsLoading
  } = useErrorContext();

  /**
   * Handle errors for async operations with loading state management
   */
  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    options: {
      context?: string;
      onSuccess?: (result: T) => void;
      onFinally?: () => void;
    } = {}
  ): Promise<T | null> => {
    const { context = "operation", onSuccess, onFinally } = options;
    
    setIsLoading(true);
    clearError();
    
    try {
      const result = await operation();
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (error) {
      notifyError(error, context);
      return null;
    } finally {
      setIsLoading(false);
      if (onFinally) {
        onFinally();
      }
    }
  }, [setIsLoading, clearError, notifyError]);

  /**
   * Set form validation errors
   */
  const setFormErrors = useCallback((errors: Record<string, string>) => {
    setValidationErrors(errors);
    notifyError(new ValidationError("Please fix the form errors", errors));
  }, [setValidationErrors, notifyError]);

  /**
   * Check if a specific field has a validation error
   */
  const hasFieldError = useCallback((fieldName: string): boolean => {
    return Object.keys(validationErrors).includes(fieldName);
  }, [validationErrors]);

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return validationErrors[fieldName];
  }, [validationErrors]);

  return {
    // Error notification
    notifyError,
    clearError,
    
    // Loading state
    isLoading,
    setIsLoading,
    
    // Form validation
    validationErrors,
    setFormErrors,
    clearValidationErrors,
    hasFieldError,
    getFieldError,
    
    // Async handling
    handleAsyncOperation
  };
}
