
/**
 * Authentication Hooks Module
 * 
 * This file exports all authentication-related hooks from a centralized location,
 * improving discoverability and preventing import duplication.
 */

// Export individual hook implementations
export { useAuthActions } from './use-auth-actions';
export { useAuthNavigation } from './use-auth-navigation';
export { useAuthData } from './use-auth-data';

/**
 * The following hooks are provided by the auth feature:
 * 
 * - useAuthActions: Provides methods for authentication operations (sign in, sign up, etc.)
 * - useAuthNavigation: Combines auth actions with navigation handling
 * - useAuthData: Access user authentication data and profile information
 */
