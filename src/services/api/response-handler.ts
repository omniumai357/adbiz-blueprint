
// Import necessary types and utilities
import { APIError, ValidationError } from '@/utils/error-handling';
import { logger } from '@/lib/utils/logging';

/**
 * Handles API responses and errors in a consistent way
 */
export const responseHandler = {
  /**
   * Process a successful response
   */
  success<T>(data: T, status = 200) {
    return {
      data,
      status,
      success: true,
      error: null
    };
  },

  /**
   * Process an error response
   */
  error(error: unknown, context: string = 'API') {
    logger.error(`API Error: ${error instanceof Error ? error.message : String(error)}`, { 
      context,
      data: error instanceof Error ? { stack: error.stack } : {}
    });

    // Determine error type and create appropriate error response
    if (error instanceof APIError) {
      return {
        data: null,
        status: error.status,
        success: false,
        error: {
          message: error.message,
          type: 'api_error',
          details: { endpoint: error.endpoint }
        }
      };
    }

    if (error instanceof ValidationError) {
      return {
        data: null,
        status: 400,
        success: false,
        error: {
          message: error.message,
          type: 'validation_error',
          details: { fields: error.fieldErrors }
        }
      };
    }

    if (error instanceof Error) {
      return {
        data: null,
        status: 500,
        success: false,
        error: {
          message: error.message,
          type: error.name.toLowerCase().replace('error', '_error'),
          details: {}
        }
      };
    }

    // Generic error handling
    return {
      data: null,
      status: 500,
      success: false,
      error: {
        message: String(error),
        type: 'unknown_error',
        details: {}
      }
    };
  },

  /**
   * Handle a response from an external API
   */
  async handleResponse<T>(response: Response, context: string = 'API'): Promise<T> {
    if (!response.ok) {
      // Handle error response
      const errorData = await response.json().catch(() => ({}));
      const status = response.status;
      const message = errorData.message || response.statusText || 'API request failed';
      
      throw new APIError(message, status, response.url);
    }
    
    // Handle successful response
    try {
      return await response.json();
    } catch (error) {
      logger.error('Failed to parse API response', { context, error });
      throw new Error('Failed to parse API response');
    }
  }
};
