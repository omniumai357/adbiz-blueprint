
/**
 * Authentication Feature Module
 * 
 * This file serves as the main entry point for the authentication feature.
 * It re-exports all public-facing components, hooks, and utilities from the auth feature.
 */

// Export the main context providers and hooks
export { AuthContextProvider, useAuth } from './contexts/auth-context';

// Export all auth hooks through a centralized location
export * from './hooks';

// Export auth components
export * from './components';

// Export auth types
export * from './types';

/**
 * This module provides the following functionality:
 * 
 * 1. Authentication Context - For managing auth state across the application
 * 2. Auth Hooks - For accessing and manipulating auth state
 * 3. Auth Components - Ready-to-use UI components for auth flows
 * 4. Auth Types - TypeScript types for auth-related data structures
 */
