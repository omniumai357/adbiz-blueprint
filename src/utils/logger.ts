
/**
 * Centralized logging utility that provides consistent logging with severity levels
 * and conditional output based on environment
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
}

let config: LoggerConfig = {
  minLevel: DEFAULT_MIN_LEVEL,
  enabled: true
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

/**
 * Log a message with the specified level if the level is enabled
 */
const log = (level: LogLevel, message: string, ...args: any[]) => {
  if (!config.enabled) return;
  
  // Only log if the level priority is less than or equal to the minimum level priority
  if (logLevelPriority[level] <= logLevelPriority[config.minLevel]) {
    // Format the context if provided
    const context = args.length > 0 && typeof args[0] === 'string' ? `[${args.shift()}]` : '';
    const formattedMessage = context ? `${context} ${message}` : message;
    
    logMethods[level](formattedMessage, ...args);
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

// Expose log methods with consistent interface
export const logger = {
  error: (message: string, ...args: any[]) => log(LogLevel.ERROR, message, ...args),
  warn: (message: string, ...args: any[]) => log(LogLevel.WARN, message, ...args),
  info: (message: string, ...args: any[]) => log(LogLevel.INFO, message, ...args),
  debug: (message: string, ...args: any[]) => log(LogLevel.DEBUG, message, ...args),
  
  // Special method for critical errors that should always be logged
  critical: (message: string, error?: Error, ...args: any[]) => {
    // Always log critical errors regardless of level
    console.error(message, error, ...args);
    
    // In production, you could send to an error reporting service here
    if (isProduction) {
      // Example: errorReportingService.report(message, error, ...args);
    }
  }
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
