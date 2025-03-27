
/**
 * Unified error handling utilities with standardized logging, formatting,
 * and user feedback
 */
import { toast } from "sonner";
import { logger, formatErrorDetails } from '../logger';
import { formatErrorMessage } from './format-errors';
import { isRetryableError } from './network-errors';

type ErrorContext = {
  component?: string;
  operation?: string;
  data?: Record<string, any>;
};

/**
 * Handle errors with consistent pattern using Sonner toast and centralized logging
 * 
 * @param error The error that occurred
 * @param context Additional context information
 * @param options Configuration options for error handling
 * @returns Formatted error message
 */
export const handleError = (
  error: unknown, 
  context: string | ErrorContext = '', 
  options: {
    showToast?: boolean;
    logLevel?: 'error' | 'warn' | 'debug';
    toastDuration?: number;
    allowRetry?: boolean;
  } = {}
): string => {
  const {
    showToast = true,
    logLevel = 'error',
    toastDuration = 5000,
    allowRetry = true
  } = options;
  
  // Normalize context
  const errorContext = typeof context === 'string' 
    ? { component: context } 
    : context;
  
  // Format for display
  const message = formatErrorMessage(error);
  
  // Log error with detailed information
  const logData = {
    context: errorContext.component,
    data: {
      ...formatErrorDetails(error),
      ...errorContext.data,
      operation: errorContext.operation
    }
  };
  
  // Log at appropriate level
  if (logLevel === 'warn') {
    logger.warn(`Error in ${errorContext.operation || 'operation'}: ${message}`, logData);
  } else if (logLevel === 'debug') {
    logger.debug(`Error in ${errorContext.operation || 'operation'}: ${message}`, logData);
  } else {
    logger.error(`Error in ${errorContext.operation || 'operation'}: ${message}`, logData);
  }
  
  // Show toast if requested
  if (showToast) {
    const isNetworkRetryable = allowRetry && isRetryableError(error);
    
    toast.error("Error", {
      description: message,
      duration: toastDuration,
      action: isNetworkRetryable ? {
        label: "Retry",
        onClick: () => window.location.reload()
      } : undefined
    });
  }
  
  return message;
};

/**
 * Wrap async functions with error handling
 * 
 * @param fn The async function to wrap
 * @param context Context information for error reporting
 * @param options Error handling options
 * @returns Wrapped function with error handling
 */
export const withErrorHandling = <T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  context: string | ErrorContext = '',
  options: {
    showToast?: boolean;
    logLevel?: 'error' | 'warn' | 'debug';
    rethrow?: boolean;
  } = {}
) => {
  const { showToast = true, logLevel = 'error', rethrow = false } = options;
  
  return async (...args: Args): Promise<T | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, { showToast, logLevel });
      
      if (rethrow) {
        throw error;
      }
      
      return null;
    }
  };
};

/**
 * Create an error handler with predefined context
 * 
 * @param defaultContext Default context to use for all error handling
 * @returns Error handler functions with predefined context
 */
export const createErrorHandler = (defaultContext: string | ErrorContext) => {
  return {
    handleError: (
      error: unknown, 
      additionalContext?: string | ErrorContext,
      options?: Parameters<typeof handleError>[2]
    ) => {
      const mergedContext = typeof defaultContext === 'string' && typeof additionalContext === 'string'
        ? additionalContext || defaultContext
        : {
            ...((typeof defaultContext === 'object' ? defaultContext : { component: defaultContext }) as ErrorContext),
            ...(typeof additionalContext === 'object' ? additionalContext : 
               additionalContext ? { operation: additionalContext } : {})
          };
      
      return handleError(error, mergedContext, options);
    },
    
    withErrorHandling: <T, Args extends any[]>(
      fn: (...args: Args) => Promise<T>,
      additionalContext?: string | ErrorContext,
      options?: Parameters<typeof withErrorHandling>[2]
    ) => {
      const mergedContext = typeof defaultContext === 'string' && typeof additionalContext === 'string'
        ? additionalContext || defaultContext
        : {
            ...((typeof defaultContext === 'object' ? defaultContext : { component: defaultContext }) as ErrorContext),
            ...(typeof additionalContext === 'object' ? additionalContext : 
               additionalContext ? { operation: additionalContext } : {})
          };
      
      return withErrorHandling(fn, mergedContext, options);
    }
  };
};
