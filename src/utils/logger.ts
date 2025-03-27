
/**
 * Centralized logging utility that provides consistent logging with severity levels,
 * context awareness, and conditional output based on environment
 */

// Define log levels for better organization and filtering
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// Environment check - production logs should be minimal
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Default minimum log level based on environment
const DEFAULT_MIN_LEVEL = isProduction ? LogLevel.ERROR : LogLevel.DEBUG;

// Logger configuration
interface LoggerConfig {
  minLevel: LogLevel;
  enabled: boolean;
  contextPadding: number;
}

// Default logger configuration
let config: LoggerConfig = {
  minLevel: DEFAULT_MIN_LEVEL,
  enabled: true,
  contextPadding: 15 // Default padding for context alignment
};

// Mapping log levels to console methods
const logMethods: Record<LogLevel, (message: string, ...args: any[]) => void> = {
  [LogLevel.ERROR]: console.error,
  [LogLevel.WARN]: console.warn,
  [LogLevel.INFO]: console.info,
  [LogLevel.DEBUG]: console.debug
};

// Log level priority (for filtering)
const logLevelPriority: Record<LogLevel, number> = {
  [LogLevel.ERROR]: 0,
  [LogLevel.WARN]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.DEBUG]: 3
};

// Color codes for different log levels (for development)
const logColors = {
  [LogLevel.ERROR]: '\x1b[31m', // Red
  [LogLevel.WARN]: '\x1b[33m',  // Yellow
  [LogLevel.INFO]: '\x1b[36m',  // Cyan
  [LogLevel.DEBUG]: '\x1b[90m', // Gray
  reset: '\x1b[0m'
};

// Log level symbols for easier visual identification
const logSymbols = {
  [LogLevel.ERROR]: '❌',
  [LogLevel.WARN]: '⚠️',
  [LogLevel.INFO]: 'ℹ️',
  [LogLevel.DEBUG]: '🔍'
};

/**
 * Format log message with context and level
 */
const formatLogMessage = (level: LogLevel, message: string, context?: string): string => {
  if (typeof window === 'undefined' || !isDevelopment) {
    // Basic formatting for production or server
    const contextStr = context ? `[${context}]` : '';
    return `${logSymbols[level]} ${contextStr} ${message}`;
  }
  
  // Enhanced formatting for development in browser
  const contextStr = context 
    ? `[${context.padEnd(config.contextPadding)}]` 
    : ''.padEnd(config.contextPadding + 2);
  
  const timestamp = new Date().toISOString().split('T')[1].split('Z')[0];
  return `${timestamp} ${logSymbols[level]} ${level.toUpperCase().padEnd(5)} ${contextStr} ${message}`;
};

/**
 * Log a message with the specified level if the level is enabled
 */
const log = (level: LogLevel, message: string, options: { context?: string; data?: any } = {}) => {
  if (!config.enabled) return;
  
  // Only log if the level priority is less than or equal to the minimum level priority
  if (logLevelPriority[level] <= logLevelPriority[config.minLevel]) {
    const { context, data } = options;
    
    // Format the message
    const formattedMessage = formatLogMessage(level, message, context);
    
    // Log with appropriate console method
    if (data) {
      logMethods[level](formattedMessage, data);
    } else {
      logMethods[level](formattedMessage);
    }
  }
};

/**
 * Configure the logger
 */
export const configureLogger = (newConfig: Partial<LoggerConfig>) => {
  config = { ...config, ...newConfig };
};

/**
 * Enable or disable the logger
 */
export const enableLogger = (enabled: boolean) => {
  config.enabled = enabled;
};

/**
 * Set the minimum log level
 */
export const setLogLevel = (level: LogLevel) => {
  config.minLevel = level;
};

/**
 * Format error details for consistent error logging
 */
export const formatErrorDetails = (error: unknown): Record<string, any> => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error as any).code && { code: (error as any).code },
      ...(error as any).statusCode && { statusCode: (error as any).statusCode },
    };
  }
  
  return { raw: String(error) };
};

/**
 * Create a component-specific logger with a predefined context
 */
export const createComponentLogger = (component: string) => {
  return {
    error: (message: string, data?: any) => log(LogLevel.ERROR, message, { context: component, data }),
    warn: (message: string, data?: any) => log(LogLevel.WARN, message, { context: component, data }),
    info: (message: string, data?: any) => log(LogLevel.INFO, message, { context: component, data }),
    debug: (message: string, data?: any) => log(LogLevel.DEBUG, message, { context: component, data })
  };
};

/**
 * Create a performance logger for timing operations
 */
export const createPerformanceLogger = (operationName: string, context?: string) => {
  let startTime: number;
  
  return {
    start: () => {
      startTime = performance.now();
      log(LogLevel.DEBUG, `⏱️ Starting ${operationName}`, { context });
    },
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      log(LogLevel.DEBUG, `⏱️ ${operationName} completed in ${duration.toFixed(2)}ms`, { context });
      return duration;
    }
  };
};

// Expose log methods with consistent interface
export const logger = {
  error: (message: string, options?: { context?: string; data?: any }) => 
    log(LogLevel.ERROR, message, options),
  warn: (message: string, options?: { context?: string; data?: any }) => 
    log(LogLevel.WARN, message, options),
  info: (message: string, options?: { context?: string; data?: any }) => 
    log(LogLevel.INFO, message, options),
  debug: (message: string, options?: { context?: string; data?: any }) => 
    log(LogLevel.DEBUG, message, options),
  
  // Special method for critical errors that should always be logged
  critical: (message: string, error?: Error, additionalData?: any) => {
    // Always log critical errors regardless of level
    console.error(`CRITICAL: ${message}`, error, additionalData);
    
    // In production, you could send to an error reporting service here
    if (isProduction) {
      // Example: errorReportingService.report(message, error, additionalData);
    }
  },
  
  // Helper factory methods
  createComponentLogger,
  createPerformanceLogger
};

// Development helpers
if (isDevelopment) {
  // Expose configuration in development for easier debugging
  (window as any).__loggerConfig = {
    getConfig: () => ({ ...config }),
    setConfig: configureLogger,
    enableLogs: enableLogger,
    setLevel: setLogLevel
  };
}
