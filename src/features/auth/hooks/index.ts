
/**
 * Authentication Hooks Module
 * 
 * This file exports all authentication-related hooks from a centralized location,
 * improving discoverability and preventing import duplication.
 * 
 * The hooks are organized according to their purpose:
 * - Core hooks for authentication state and actions
 * - Navigation-enhanced hooks for auth flows with routing
 * - Data access hooks for retrieving user information
 */

// Core authentication hooks
export { useAuthActions } from './use-auth-actions';
export { useAuthData } from './use-auth-data';
export { useAuth } from '../contexts/auth-context';

// Authentication with navigation
export { useAuthNavigation } from './use-auth-navigation';

/**
 * Available authentication hooks:
 * 
 * - useAuth: Main hook for accessing authentication context and state
 * - useAuthActions: Core authentication operations (sign in, sign up, etc.)
 * - useAuthData: Simpler hook for just accessing user authentication data
 * - useAuthNavigation: Authentication actions with navigation handling
 */
