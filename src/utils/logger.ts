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

// Flexible data object type for logging
export interface LogData {
  context?: string;
  data?: any;
  error?: any; // Add error property explicitly
}

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
  
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  return `${timestamp} ${logSymbols[level]} ${contextStr} ${message}`;
};

/**
 * Generic logging function with context and data support
 */
export function log(level: LogLevel, message: string, data?: LogData) {
  if (logLevelPriority[level] > logLevelPriority[config.minLevel] || !config.enabled) {
    return;
  }

  if (!data) {
    logMethods[level](formatLogMessage(level, message));
    return;
  }

  // Extract context from data object if it exists
  const { context, ...restData } = data as LogData;
  const formattedMessage = formatLogMessage(level, message, context);
  
  // If there are other data properties, log them
  const hasData = Object.keys(restData).length > 0;
  
  if (hasData) {
    logMethods[level](formattedMessage, restData);
  } else {
    logMethods[level](formattedMessage);
  }
}

/**
 * Main logger object with methods for different log levels
 */
export const logger = {
  error: (message: string, data?: LogData) => log(LogLevel.ERROR, message, data),
  warn: (message: string, data?: LogData) => log(LogLevel.WARN, message, data),
  info: (message: string, data?: LogData) => log(LogLevel.INFO, message, data),
  debug: (message: string, data?: LogData) => log(LogLevel.DEBUG, message, data),
  
  /**
   * Create a context-specific logger
   */
  createContextLogger: (defaultContext: string) => ({
    error: (message: string, data?: LogData) => 
      log(LogLevel.ERROR, message, { context: defaultContext, ...data }),
    warn: (message: string, data?: LogData) => 
      log(LogLevel.WARN, message, { context: defaultContext, ...data }),
    info: (message: string, data?: LogData) => 
      log(LogLevel.INFO, message, { context: defaultContext, ...data }),
    debug: (message: string, data?: LogData) => 
      log(LogLevel.DEBUG, message, { context: defaultContext, ...data }),
  }),
};

/**
 * Format error details into a structured object for logging
 */
export function formatErrorDetails(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  
  return { rawError: String(error) };
}

// Utility for performance logging
export function logPerformance(operationName: string, fn: () => any) {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  logger.debug(`Operation "${operationName}" took ${duration.toFixed(2)}ms`, { 
    context: 'Performance', 
    data: {
      duration, 
      operation: operationName 
    }
  });
  return result;
}

// Enable or disable all logging
export function setLoggingEnabled(enabled: boolean) {
  config.enabled = enabled;
}

// Set the minimum log level
export function setMinLogLevel(level: LogLevel) {
  config.minLevel = level;
}
