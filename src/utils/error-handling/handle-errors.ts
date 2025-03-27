
/**
 * Utilities for handling errors in a consistent manner
 */
import { toast } from "sonner";
import { logError } from './log-errors';
import { formatErrorMessage } from './format-errors';
import { isRetryableError } from './network-errors';

/**
 * Handle errors with consistent pattern using Sonner toast
 */
export const handleError = (
  error: unknown, 
  context: string = '', 
  showToast: boolean = true
): string => {
  // Log error for debugging
  logError(error, context);
  
  // Format for display
  const message = formatErrorMessage(error);
  
  // Show toast if requested
  if (showToast) {
    toast.error("Error", {
      description: message,
      duration: 5000,
      action: isRetryableError(error) ? {
        label: "Retry",
        onClick: () => window.location.reload()
      } : undefined
    });
  }
  
  return message;
};

/**
 * Wrap async functions with error handling
 */
export const withErrorHandling = <T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  context: string = '',
  showToast: boolean = true
) => {
  return async (...args: Args): Promise<T | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, showToast);
      return null;
    }
  };
};
