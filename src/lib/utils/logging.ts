
/**
 * Enhanced logging utility that extends the base logger with additional features
 * for component-specific logging, performance tracking, and structured formats.
 */
import { logger, LogLevel } from '@/utils/logger';

/**
 * Component-specific logger that prefixes all logs with component name
 * 
 * @param componentName Name of the component for context
 * @returns Logger functions with component context
 */
export const createComponentLogger = (componentName: string) => {
  return {
    error: (message: string, ...args: any[]) => 
      logger.error(message, componentName, ...args),
    warn: (message: string, ...args: any[]) => 
      logger.warn(message, componentName, ...args),
    info: (message: string, ...args: any[]) => 
      logger.info(message, componentName, ...args),
    debug: (message: string, ...args: any[]) => 
      logger.debug(message, componentName, ...args)
  };
};

/**
 * Performance tracking logger to measure execution time
 * 
 * @param operationName Name of the operation being timed
 * @param context Optional context identifier (component, function, etc.)
 * @returns Object with start and end methods for timing
 */
export const createPerformanceLogger = (operationName: string, context?: string) => {
  let startTime: number;
  
  return {
    start: () => {
      startTime = performance.now();
      logger.debug(`⏱️ Starting ${operationName}`, context);
    },
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logger.debug(`⏱️ ${operationName} completed in ${duration.toFixed(2)}ms`, context);
      return duration;
    }
  };
};

/**
 * User action logger for tracking UI interactions
 * 
 * @param area Application area where actions occur
 * @returns Methods for logging different types of user actions
 */
export const createUserActionLogger = (area: string) => {
  return {
    click: (element: string, details?: any) => {
      logger.info(`👆 Click: ${element}`, area, details);
    },
    input: (field: string, details?: any) => {
      logger.debug(`✏️ Input: ${field}`, area, details);
    },
    navigation: (from: string, to: string) => {
      logger.info(`🔄 Navigation: ${from} → ${to}`, area);
    },
    complete: (action: string, details?: any) => {
      logger.info(`✅ Completed: ${action}`, area, details);
    }
  };
};

/**
 * Error details formatter for structured error logging
 * 
 * @param error Error object to format
 * @returns Formatted error details
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

export { logger, LogLevel };
