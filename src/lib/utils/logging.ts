
/**
 * Centralized logging utility with structured logging capabilities
 */

export interface LogData {
  context?: string;
  data?: Record<string, any>;
  [key: string]: any; // Allow arbitrary properties for flexibility
  
  // Explicitly define commonly used properties to improve TypeScript support
  email?: string;
  hasLogo?: boolean;
  step?: string | number;
  count?: number;
  fileType?: string;
  businessId?: string;
  fileName?: string;
  url?: string;
  fileSize?: number;
  actualType?: string;
  fileTypes?: string[];
  error?: any;
  currentStep?: string | number;
  packageName?: string;
  milestoneId?: string;
  milestoneName?: string;
  totalMilestones?: number;
  completedMilestones?: number;
  availableRewards?: number;
}

// Define a logger class with methods for different log levels
export class Logger {
  debug(message: string, data?: LogData): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: LogData): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: LogData): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: LogData): void {
    this.log('error', message, data);
  }

  // Internal method to handle logging with consistent format
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: LogData): void {
    const timestamp = new Date().toISOString();
    const context = data?.context || 'App';
    const logData = data?.data || {};
    
    // In development, use console methods directly
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      const logFn = console[level] || console.log;
      logFn(`[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`, logData);
    } else {
      // In production, we might want to send logs to a service
      // For now, we'll just use console with a simpler format
      console[level](`[${level.toUpperCase()}] [${context}] ${message}`, logData);
    }
  }
}

// Create a singleton instance of the logger
export const logger = new Logger();

/**
 * Create a component-specific logger to simplify logging context
 * 
 * @param componentName Name of the component for logging context
 * @returns Logger methods that automatically include the component context
 */
export function createComponentLogger(componentName: string) {
  return {
    debug: (message: string, data?: any) => {
      logger.debug(message, { context: componentName, data });
    },
    info: (message: string, data?: any) => {
      logger.info(message, { context: componentName, data });
    },
    warn: (message: string, data?: any) => {
      logger.warn(message, { context: componentName, data });
    },
    error: (message: string, data?: any) => {
      logger.error(message, { context: componentName, data });
    },
  };
}

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
