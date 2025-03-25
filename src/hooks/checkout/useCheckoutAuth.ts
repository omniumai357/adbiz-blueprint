
import { useAuthUser } from "@/hooks/queries/useAuthUser";

/**
 * Hook for accessing authentication data in the checkout flow
 * 
 * Provides user authentication data and status for use in checkout components
 * 
 * @returns Authentication data including user, loading state, and authentication status
 */
export const useCheckoutAuth = () => {
  const { data, isLoading, error } = useAuthUser();
  
  return {
    user: data?.user || null,
    isLoading,
    error,
    isAuthenticated: !!data?.user
  };
};
