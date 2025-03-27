
import { useAuth } from "../contexts/auth-context";

/**
 * Hook to access user authentication data
 * 
 * This is a wrapper around useAuth that focuses specifically on
 * accessing user authentication data, for components that don't need
 * the full auth context
 */
export const useAuthData = () => {
  const { user, profile, isLoading, isAuthenticated, isAdmin } = useAuth();
  
  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isAdmin
  };
};
