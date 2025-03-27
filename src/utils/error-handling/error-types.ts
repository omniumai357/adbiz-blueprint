
/**
 * Custom error types for application-specific errors
 */

/**
 * Error thrown when an API request fails
 */
export class APIError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

/**
 * Error thrown when user authentication is required
 */
export class AuthenticationError extends Error {
  constructor(message: string = 'You must be logged in to perform this action') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error thrown when form validation fails
 */
export class ValidationError extends Error {
  fields?: Record<string, string>;
  
  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
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
  
  constructor(message: string, retryable: boolean = true) {
    super(message);
    this.name = 'NetworkError';
    this.retryable = retryable;
  }
}
