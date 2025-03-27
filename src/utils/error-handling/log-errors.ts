
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
  // Default log data
  const logData: LogData = { context };
  
  // Map error types to appropriate logging methods
  if (error instanceof APIError) {
    logger.error(`API Error: ${error.message}`, {
      context,
      data: { 
        statusCode: error.statusCode
      }
    });
  } else if (error instanceof ValidationError) {
    logger.warn(`Validation Error: ${error.message}`, { 
      context,
      data: { 
        validationErrors: error.errors 
      }
    });
  } else if (error instanceof AuthenticationError) {
    logger.error(`Auth Error: ${error.message}`, { 
      context,
      data: { 
        method: error.method 
      }
    });
  } else if (error instanceof NetworkError) {
    logger.error(`Network Error: ${error.message}`, { 
      context,
      data: { 
        url: error.url,
        status: error.status
      }
    });
  } else if (error instanceof Error) {
    logger.error(`Error: ${error.message}`, { 
      context, 
      data: {
        stack: error.stack
      }
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
    data: {
      method,
      url
    }
  };
  
  if (error instanceof Error) {
    data.data.errorType = error.constructor.name;
    data.data.stack = error.stack;
  }
  
  logger.error(`Request failed: ${method} ${url}`, data);
}

/**
 * Logs performance issues when response time exceeds threshold
 */
export function logSlowResponse(responseTime: number, threshold: number, endpoint: string) {
  logger.warn(`Slow response detected: ${responseTime}ms (threshold: ${threshold}ms)`, {
    context: 'Performance',
    data: {
      responseTime,
      threshold,
      endpoint
    }
  });
}
