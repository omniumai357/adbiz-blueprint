
/**
 * Custom error types used throughout the application
 * 
 * These provide more specific error information and context
 * than the standard Error class.
 */

export class APIError extends Error {
  status: number;
  endpoint: string; // Added missing property
  
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

export class ValidationError extends Error {
  fieldErrors: Record<string, string>; // Added missing property
  
  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class AuthenticationError extends Error {
  action: string; // Added missing property
  
  constructor(message: string, action: string = 'access') {
    super(message);
    this.name = 'AuthenticationError';
    this.action = action;
  }
}

export class NetworkError extends Error {
  requestInfo: any; // Added missing property
  
  constructor(message: string, requestInfo: any = {}) {
    super(message);
    this.name = 'NetworkError';
    this.requestInfo = requestInfo;
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
