
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
  },

  /**
   * Handle a Supabase query response with standardized error handling and transformation
   */
  handle<T>(
    query: Promise<any>, 
    options: {
      context?: string;
      transform?: (response: any) => T;
      showErrorToast?: boolean;
      showSuccessToast?: boolean;
      successMessage?: string;
    } = {}
  ): Promise<T> {
    const { 
      context = 'API',
      transform = (response) => response.data as T,
      showErrorToast = false,
      showSuccessToast = false,
      successMessage = 'Operation successful'
    } = options;

    return query
      .then((response) => {
        if (response.error) {
          throw new APIError(
            response.error.message || 'An error occurred',
            response.status || 500,
            context
          );
        }
        
        // If success toast is requested, we would show it here
        if (showSuccessToast) {
          // Placeholder for toast notification
          console.info(successMessage);
        }

        return transform(response);
      })
      .catch((error) => {
        logger.error(`API Error in ${context}:`, { 
          context,
          data: { error: error instanceof Error ? error.message : String(error) }
        });
        
        // If error toast is requested, we would show it here
        if (showErrorToast) {
          // Placeholder for toast notification
          console.error(error.message || 'An unexpected error occurred');
        }
        
        throw error;
      });
  }
};
