
/**
 * Utilities for logging errors
 */
import { 
  APIError, 
  ValidationError, 
  AuthenticationError, 
  NetworkError 
} from './error-types';
import { logger } from '../logger';

/**
 * Log errors to console with consistent formatting
 */
export const logError = (error: unknown, context: string = ''): void => {
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
    if ('code' in error && error.code) {
      logger.debug(`${contextPrefix}Error Code:`, error.code);
    }
  } else {
    // For non-Error objects
    logger.error(`${contextPrefix}Unknown Error:`, error);
  }
};
