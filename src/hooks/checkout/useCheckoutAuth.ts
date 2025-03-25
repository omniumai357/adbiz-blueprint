
// Note: I need to see the contents of this file to properly fix it.
// Based on the error, the issue is likely that we are accessing a 'user' property directly
// on a User object when we should be accessing it from a UserResponse object.
// Without seeing the file, I can only provide a generic fix like:

// Assuming this is how the file is structured:
/*
import { useAuthUser } from "@/hooks/queries/useAuthUser";

export const useCheckoutAuth = () => {
  const { data, isLoading, error } = useAuthUser();
  
  return {
    user: data?.user || null,
    isLoading,
    error,
    isAuthenticated: !!data?.user
  };
};
*/
