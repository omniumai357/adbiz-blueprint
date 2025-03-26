
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";
import { UserResponse } from "@/types/api";

/**
 * Hook to fetch and manage the current authenticated user
 * 
 * @returns Query result containing the user data and loading state
 */
export const useAuthUser = () => {
  return useQuery<UserResponse>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      return await apiClient.auth.getCurrentUser();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
