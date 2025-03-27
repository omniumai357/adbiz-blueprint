
import { toast } from "sonner";
import { logger } from "./logger";

/**
 * Custom error types for application-specific errors
 */
export class APIError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'You must be logged in to perform this action') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  fields?: Record<string, string>;
  
  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class PaymentError extends Error {
  code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
  }
}

export class NetworkError extends Error {
  retryable: boolean;
  
  constructor(message: string, retryable: boolean = true) {
    super(message);
    this.name = 'NetworkError';
    this.retryable = retryable;
  }
}

/**
 * Format error messages for user display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Return specific messages for known error types
    if (error instanceof ValidationError) {
      return error.message || 'Please check the form for errors';
    }
    if (error instanceof AuthenticationError) {
      return error.message || 'Authentication required';
    }
    if (error instanceof PaymentError) {
      return error.message || 'Payment processing failed';
    }
    if (error instanceof APIError) {
      return `${error.message || 'Service unavailable'} (${error.statusCode})`;
    }
    if (error instanceof NetworkError) {
      return `${error.message} ${error.retryable ? 'Please try again.' : ''}`;
    }
    
    // Generic error with message
    return error.message || 'An unexpected error occurred';
  }
  
  // Handle non-Error objects with message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }
  
  // Unknown error type
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Log errors to console with consistent formatting
 */
export const logError = (error: unknown, context: string = ''): void => {
  const timestamp = new Date().toISOString();
  const contextPrefix = context ? `[${context}]` : '';
  
  if (error instanceof Error) {
    // Log different levels based on error type
    if (error instanceof APIError && error.statusCode >= 500) {
      logger.error(`${contextPrefix}Server Error:`, error);
    } else if (error instanceof ValidationError) {
      logger.warn(`${contextPrefix}Validation Error:`, error);
    } else if (error instanceof AuthenticationError) {
      logger.warn(`${contextPrefix}Auth Error:`, error);
    } else if (error instanceof NetworkError) {
      logger.error(`${contextPrefix}Network Error:`, error);
    } else {
      logger.error(`${contextPrefix}Error:`, error);
    }
    
    // Additional properties for specific error types
    if (error.stack) {
      logger.debug(`${contextPrefix}Stack trace:`, error.stack);
    }
    
    if (error instanceof APIError) {
      logger.debug(`${contextPrefix}Status Code:`, error.statusCode);
    }
    if (error instanceof ValidationError && error.fields) {
      logger.debug(`${contextPrefix}Validation Fields:`, error.fields);
    }
    if (error instanceof PaymentError && error.code) {
      logger.debug(`${contextPrefix}Payment Error Code:`, error.code);
    }
  } else {
    // For non-Error objects
    logger.error(`${contextPrefix}Unknown Error:`, error);
  }
};

/**
 * Create a helpful error message for network failures
 */
export const createNetworkErrorMessage = (error: unknown): string => {
  // Check for offline status
  if (!navigator.onLine) {
    return "You appear to be offline. Please check your internet connection and try again.";
  }
  
  // Handle timeout errors
  if (error instanceof Error && error.message.includes('timeout')) {
    return "The request timed out. The server might be experiencing high load.";
  }
  
  // Handle CORS errors
  if (error instanceof Error && (
    error.message.includes('CORS') || 
    error.message.includes('Cross-Origin')
  )) {
    return "A cross-origin error occurred. This is usually a configuration issue.";
  }
  
  return "A network error occurred. Please try again later.";
};

/**
 * Check if an error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  // Network errors are generally retryable
  if (error instanceof NetworkError) {
    return error.retryable;
  }
  
  // Specific status codes that are retryable
  if (error instanceof APIError) {
    return [408, 429, 502, 503, 504].includes(error.statusCode);
  }
  
  // Check for offline status
  if (!navigator.onLine) {
    return true;
  }
  
  return false;
};

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
