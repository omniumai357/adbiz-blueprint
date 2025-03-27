
/**
 * Utilities for formatting error messages for display
 */
import { 
  APIError, 
  AuthenticationError, 
  ValidationError, 
  PaymentError, 
  NetworkError 
} from './error-types';

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
