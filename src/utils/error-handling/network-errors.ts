
import { NetworkError, APIError } from './error-types';

/**
 * Helper functions for handling network-related errors
 */

/**
 * Create a specific NetworkError based on the type of network failure
 */
export function createNetworkError(message: string, requestInfo: any = {}): NetworkError {
  // Check if it's a cross-origin error
  if (message.includes('Network Error') || message.includes('Failed to fetch')) {
    return new NetworkError(
      'Unable to connect to the server. Please check your internet connection.',
      requestInfo,
      true // retryable
    );
  }
  
  // Check if it's a timeout
  if (message.includes('timeout') || message.includes('Timeout')) {
    return new NetworkError(
      'The request timed out. The server might be slow or unavailable.',
      requestInfo,
      true // retryable
    );
  }
  
  // Generic network error
  return new NetworkError(message, requestInfo, false);
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: Error): boolean {
  if (error instanceof NetworkError) {
    return error.retryable;
  }
  
  if (error instanceof APIError) {
    // 5xx errors and some 4xx errors are retryable
    return error.status >= 500 || error.status === 429 || error.status === 408;
  }
  
  return false;
}

/**
 * Create an appropriate error object based on an HTTP response
 */
export function createErrorFromResponse(response: Response, url: string): Error {
  const status = response.status;
  
  // Client errors (400-499)
  if (status >= 400 && status < 500) {
    switch (status) {
      case 401:
        return new APIError('You need to sign in to access this resource', status, url);
      case 403:
        return new APIError('You don\'t have permission to access this resource', status, url);
      case 404:
        return new APIError('The requested resource was not found', status, url);
      case 422:
        return new APIError('The request could not be processed due to validation errors', status, url);
      case 429:
        return new APIError('Too many requests. Please try again later', status, url);
      default:
        return new APIError(`Request failed with status: ${status}`, status, url);
    }
  }
  
  // Server errors (500-599)
  if (status >= 500) {
    return new APIError('A server error occurred. Please try again later', status, url);
  }
  
  // Unknown status code
  return new APIError(`Unexpected response status: ${status}`, status, url);
}
