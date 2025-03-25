
import { toast } from "@/hooks/ui/use-toast";

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
      return error.message || 'Service unavailable';
    }
    
    // Generic error with message
    return error.message || 'An unexpected error occurred';
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
  const contextPrefix = context ? `[${context}] ` : '';
  
  console.error(`${contextPrefix}Error ${timestamp}:`, error);
  
  if (error instanceof Error) {
    if (error.stack) {
      console.error(`${contextPrefix}Stack trace:`, error.stack);
    }
  }
};

/**
 * Handle errors with consistent pattern
 * - Logs the error
 * - Shows a toast notification
 * - Returns formatted message for component use
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
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
      duration: 5000
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
