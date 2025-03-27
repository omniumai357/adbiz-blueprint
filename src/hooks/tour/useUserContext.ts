
import { useAuth } from "@/features/auth";
import { useAuthUser } from "@/hooks/queries/useAuthUser";

/**
 * Hook to get user context information from available sources
 * 
 * @returns Object containing user ID and user type
 */
export function useUserContext() {
  // Try to get user information from auth context first
  let userId: string | undefined;
  let userType: string | undefined;
  
  try {
    // Use the auth context if available
    const { user, profile } = useAuth();
    userId = user?.id;
    // Use the profile role or user type, or default to anonymous
    userType = profile?.role || user?.type || 'anonymous';
  } catch (error) {
    // Fallback to useAuthUser if auth context isn't available
    const { data: authData } = useAuthUser();
    userId = authData?.user?.id;
    userType = 'anonymous'; // Default user type when profile isn't available
  }

  return {
    userId,
    userType
  };
}
