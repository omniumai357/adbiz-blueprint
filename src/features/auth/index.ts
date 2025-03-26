
/**
 * Auth Feature Module
 * 
 * Centralizes all authentication-related components, hooks, and utilities
 * for cleaner imports and better organization.
 */

// Export components
export { AuthContainer } from './components/auth-container';
export { AuthMessage } from './components/auth-message';
export { SignInForm } from './components/sign-in-form';
export { SignUpForm } from './components/sign-up-form';
export { WelcomeCoupon } from './components/welcome-coupon';

// Export contexts and hooks
export { AuthContext, AuthContextProvider, useAuth } from './contexts/auth-context';
export { useAuthActions } from './hooks/use-auth-actions';
export { useAuthNavigation } from './hooks/use-auth-navigation';
export { useAuthData } from './hooks/use-auth-data';

// Export types
export type { AuthContextType } from './types';
