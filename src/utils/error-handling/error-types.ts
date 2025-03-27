
/**
 * Custom error types used throughout the application
 * 
 * These provide more specific error information and context
 * than the standard Error class.
 */

export class APIError extends Error {
  status: number;
  endpoint: string;
  statusCode: number; // Added for compatibility with existing code
  
  constructor(message: string, status: number, endpoint: string = '') {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusCode = status; // Match status with statusCode for compatibility
    this.endpoint = endpoint;
  }
}

export class ValidationError extends Error {
  fieldErrors: Record<string, string>;
  fields: Record<string, string>; // Added for compatibility
  errors?: Record<string, string>; // Added for compatibility
  
  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
    this.fields = fieldErrors; // Alias for compatibility
    this.errors = fieldErrors; // Alias for compatibility
  }
}

export class AuthenticationError extends Error {
  action: string;
  method: string; // Added for compatibility
  
  constructor(message: string, action: string = 'access', method: string = 'token') {
    super(message);
    this.name = 'AuthenticationError';
    this.action = action;
    this.method = method;
  }
}

export class NetworkError extends Error {
  requestInfo: any;
  url: string; // Added for compatibility
  status: number; // Added for compatibility
  retryable: boolean; // Added for compatibility
  
  constructor(message: string, requestInfo: any = {}, retryable: boolean = false) {
    super(message);
    this.name = 'NetworkError';
    this.requestInfo = requestInfo;
    this.url = requestInfo.url || '';
    this.status = requestInfo.status || 0;
    this.retryable = retryable;
  }
}

export class ResourceNotFoundError extends Error {
  resourceType: string;
  resourceId: string;
  
  constructor(resourceType: string, resourceId: string) {
    super(`${resourceType} with ID ${resourceId} was not found`);
    this.name = 'ResourceNotFoundError';
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }
}

export class PermissionError extends Error {
  resourceType: string;
  action: string;
  
  constructor(resourceType: string, action: string) {
    super(`You don't have permission to ${action} this ${resourceType}`);
    this.name = 'PermissionError';
    this.resourceType = resourceType;
    this.action = action;
  }
}

export class RateLimitError extends Error {
  retryAfter: number;
  
  constructor(message: string, retryAfter: number = 60) {
    super(message || 'Rate limit exceeded. Please try again later.');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class BusinessLogicError extends Error {
  code: string;
  details: any;
  
  constructor(message: string, code: string = 'business_rule_violation', details: any = {}) {
    super(message);
    this.name = 'BusinessLogicError';
    this.code = code;
    this.details = details;
  }
}

export class PaymentError extends Error {
  paymentId?: string;
  provider?: string;
  statusCode?: number;
  
  constructor(message: string, paymentId?: string, provider: string = 'generic') {
    super(message || 'Payment processing failed');
    this.name = 'PaymentError';
    this.paymentId = paymentId;
    this.provider = provider;
  }
}
