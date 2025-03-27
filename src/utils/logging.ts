
/**
 * Centralized logging utility
 * 
 * Provides consistent logging throughout the application with categorization,
 * context awareness, and environment-based filtering.
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogOptions {
  context?: string;
  data?: Record<string, any>;
  tags?: string[];
}

// Control which log levels are displayed in different environments
const LOG_LEVELS: Record<string, LogLevel[]> = {
  development: ['error', 'warn', 'info', 'debug'],
  test: ['error', 'warn'],
  production: ['error']
};

// Get current environment
const currentEnv = process.env.NODE_ENV || 'development';

// Determine which levels to show
const enabledLevels = LOG_LEVELS[currentEnv] || LOG_LEVELS.development;

/**
 * Main logging function to standardize log output
 */
const log = (level: LogLevel, message: string, options: LogOptions = {}) => {
  // Skip if this level is not enabled for current environment
  if (!enabledLevels.includes(level)) return;
  
  const { context, data, tags } = options;
  
  // Format the log details
  const prefix = context ? `[${context}]` : '';
  const tagString = tags && tags.length ? `(${tags.join(', ')})` : '';
  const formattedMessage = `${prefix} ${message} ${tagString}`.trim();
  
  // Apply the appropriate console method
  switch (level) {
    case 'error':
      console.error(formattedMessage, data || '');
      break;
    case 'warn':
      console.warn(formattedMessage, data || '');
      break;
    case 'info':
      console.info(formattedMessage, data || '');
      break;
    case 'debug':
      console.debug(formattedMessage, data || '');
      break;
  }
};

/**
 * Logging utility object with methods for different log levels
 */
export const logging = {
  /**
   * Log error messages
   */
  error: (message: string, options?: LogOptions) => log('error', message, options),
  
  /**
   * Log warning messages
   */
  warn: (message: string, options?: LogOptions) => log('warn', message, options),
  
  /**
   * Log informational messages
   */
  info: (message: string, options?: LogOptions) => log('info', message, options),
  
  /**
   * Log debug messages (only shown in development)
   */
  debug: (message: string, options?: LogOptions) => log('debug', message, options),
  
  /**
   * Create a logger instance with a predefined context
   */
  createLogger: (defaultContext: string) => ({
    error: (message: string, options?: LogOptions) => 
      log('error', message, { ...options, context: options?.context || defaultContext }),
    warn: (message: string, options?: LogOptions) => 
      log('warn', message, { ...options, context: options?.context || defaultContext }),
    info: (message: string, options?: LogOptions) => 
      log('info', message, { ...options, context: options?.context || defaultContext }),
    debug: (message: string, options?: LogOptions) => 
      log('debug', message, { ...options, context: options?.context || defaultContext }),
  }),
  
  /**
   * Record performance metrics
   */
  performance: (operationName: string, fn: () => any) => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    log('debug', `Operation "${operationName}" took ${duration.toFixed(2)}ms`, { tags: ['performance'] });
    return result;
  },
  
  /**
   * Log an API request
   */
  apiRequest: (method: string, url: string, data?: any) => {
    log('debug', `API ${method} ${url}`, { 
      context: 'API',
      data: data ? { requestData: data } : undefined,
      tags: ['api', 'request']
    });
  },
  
  /**
   * Log an API response
   */
  apiResponse: (method: string, url: string, statusCode: number, data?: any) => {
    const level = statusCode >= 400 ? 'error' : 'debug';
    log(level, `API ${method} ${url} - ${statusCode}`, { 
      context: 'API',
      data: data ? { responseData: data } : undefined,
      tags: ['api', 'response']
    });
  }
};

// Export a default logger instance for general use
export const logger = logging.createLogger('App');

// Enable or disable all logging
export const enableLogging = (enabled: boolean) => {
  if (!enabled) {
    // Override all console methods with empty functions
    const noop = () => {};
    console.log = noop;
    console.error = noop;
    console.warn = noop;
    console.info = noop;
    console.debug = noop;
  } else {
    // Restore original console methods (if possible in the environment)
    // This may not work in all browsers
  }
};
