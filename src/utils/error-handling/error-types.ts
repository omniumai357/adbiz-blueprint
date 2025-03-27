
/**
 * Custom error types for application-specific errors
 */

/**
 * Error thrown when an API request fails
 */
export class APIError extends Error {
  statusCode: number;
  endpoint?: string;
  
  constructor(message: string, statusCode: number = 500, endpoint?: string) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}

/**
 * Error thrown when user authentication is required
 */
export class AuthenticationError extends Error {
  method?: string;
  action?: string;
  
  constructor(message: string = 'You must be logged in to perform this action', method?: string, action?: string) {
    super(message);
    this.name = 'AuthenticationError';
    this.method = method;
    this.action = action;
  }
}

/**
 * Error thrown when form validation fails
 */
export class ValidationError extends Error {
  fields?: Record<string, string>;
  errors?: Record<string, string>;
  
  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
    this.errors = fields; // For compatibility
  }
}

/**
 * Error thrown when a payment operation fails
 */
export class PaymentError extends Error {
  code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
  }
}

/**
 * Error thrown when a network request fails
 */
export class NetworkError extends Error {
  retryable: boolean;
  url?: string;
  status?: number;
  requestInfo?: any;
  
  constructor(message: string, retryable: boolean = true, url?: string, status?: number) {
    super(message);
    this.name = 'NetworkError';
    this.retryable = retryable;
    this.url = url;
    this.status = status;
  }
}
