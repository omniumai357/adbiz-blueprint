
/**
 * Authentication hooks index file
 * 
 * This file exports all authentication-related hooks from a centralized location,
 * improving discoverability and preventing import duplication.
 */

// Re-export individual hook implementations
export { useAuthActions } from '@/features/auth/hooks/use-auth-actions';
export { useAuthNavigation } from './useAuthNavigation';

// Re-export core authentication hooks
export { useAuth } from '@/features/auth/contexts/auth-context';
export { useAuthData } from '@/features/auth/hooks/use-auth-data';

/**
 * This module provides the following hooks:
 * 
 * - useAuth: Main hook for accessing authentication context and state
 * - useAuthActions: Core authentication operations (sign in, sign up, etc.)
 * - useAuthNavigation: Authentication actions with navigation handling
 * - useAuthData: Simpler hook for just accessing user authentication data
 */
