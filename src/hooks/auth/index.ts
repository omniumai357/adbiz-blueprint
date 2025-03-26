
/**
 * Auth Hooks Barrel Export
 * 
 * This file consolidates all authentication-related hooks exports,
 * making imports cleaner throughout the application.
 */

// Export all auth hooks
export { useAuthActions } from './useAuthActions';
export { useAuthNavigation } from './useAuthNavigation';
export { useAuthData } from './useAuthData';

// Re-export from queries directory
export { useAuthUser } from '../queries/useAuthUser';
