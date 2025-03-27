
/**
 * Utilities for handling network-related errors
 */
import { APIError, NetworkError } from './error-types';

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
