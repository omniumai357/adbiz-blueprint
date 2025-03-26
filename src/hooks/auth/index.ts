
/**
 * Auth Hooks Barrel Export
 * 
 * This file consolidates all authentication-related hooks exports,
 * making imports cleaner throughout the application.
 */

// Export all auth hooks
export { useAuthActions } from './useAuthActions';
export { useAuthNavigation } from './useAuthNavigation';

// Re-export from data directory
export { useAuthData } from '../data/useAuthData';

// Re-export from queries directory
export { useAuthUser } from '../queries/useAuthUser';
