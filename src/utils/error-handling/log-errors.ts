
import { logger, LogData } from '@/utils/logger';
import { 
  APIError, 
  ValidationError, 
  AuthenticationError, 
  NetworkError 
} from './error-types';

/**
 * Logs an error with appropriate context and severity
 * 
 * @param error The error to log
 * @param context Optional context name for the log
 */
export function logError(error: unknown, context = 'ErrorHandler') {
  // Map error types to appropriate logging methods
  if (error instanceof APIError) {
    logger.error(`API Error: ${error.message}`, { 
      context, 
      statusCode: error.statusCode, 
      endpoint: error.endpoint 
    });
  } else if (error instanceof ValidationError) {
    logger.warn(`Validation Error: ${error.message}`, { 
      context, 
      fieldErrors: error.fieldErrors 
    });
  } else if (error instanceof AuthenticationError) {
    logger.error(`Auth Error: ${error.message}`, { 
      context, 
      authAction: error.action 
    });
  } else if (error instanceof NetworkError) {
    logger.error(`Network Error: ${error.message}`, { 
      context, 
      requestInfo: error.requestInfo 
    });
  } else if (error instanceof Error) {
    logger.error(`Error: ${error.message}`, { 
      context, 
      stack: error.stack 
    });
  } else {
    // Handle non-Error objects
    const errorMessage = String(error);
    logger.error(`Unknown Error: ${errorMessage}`, { context });
  }
}

/**
 * Logs request errors with rich context
 */
export function logRequestError(error: unknown, method: string, url: string, context = 'API') {
  const data: LogData = {
    context,
    method,
    url
  };
  
  if (error instanceof Error) {
    data.errorType = error.constructor.name;
    data.stack = error.stack;
  }
  
  logger.error(`Request failed: ${method} ${url}`, data);
}

/**
 * Logs performance issues when response time exceeds threshold
 */
export function logSlowResponse(responseTime: number, threshold: number, endpoint: string) {
  logger.warn(`Slow response detected: ${responseTime}ms (threshold: ${threshold}ms)`, {
    context: 'Performance',
    responseTime,
    threshold,
    endpoint
  });
}
