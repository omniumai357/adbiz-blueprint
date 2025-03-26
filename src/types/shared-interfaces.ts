
/**
 * Shared Interfaces
 * 
 * This file contains interfaces that are used across multiple features
 * to standardize communication between different parts of the application.
 */

import { User } from '@supabase/supabase-js';
import { Profile } from './api';

// Authentication state that can be shared across features
export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Common result interface for operations
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: Error | string;
  message?: string;
}

// Shared pagination interface
export interface PaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// Generic data loading state
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// Form submission state
export interface FormState extends LoadingState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isDirty: boolean;
}

// Service registry interface for consistent service access
export interface ServiceRegistry {
  get<T>(name: string): T;
  register<T>(name: string, service: T): void;
  has(name: string): boolean;
}
