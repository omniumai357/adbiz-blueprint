
/**
 * Authentication Hooks Module
 * 
 * This file exports all authentication-related hooks from a centralized location,
 * improving discoverability and preventing import duplication.
 */

// Export individual hook implementations
export { useAuthActions } from './use-auth-actions';
export { useAuthData } from './use-auth-data';
export { useAuth } from '../contexts/auth-context';

// Re-export auth navigation hook from the app-level hooks
// This maintains backward compatibility while we transition
export { useAuthNavigation } from '@/hooks/auth/useAuthNavigation';

/**
 * The following hooks are provided by the auth feature:
 * 
 * - useAuth: Main hook for accessing authentication context and state
 * - useAuthActions: Core authentication operations (sign in, sign up, etc.)
 * - useAuthData: Simpler hook for just accessing user authentication data
 * - useAuthNavigation: Authentication actions with navigation handling
 */
