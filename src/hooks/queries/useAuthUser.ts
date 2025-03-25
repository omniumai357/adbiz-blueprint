
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      return await apiClient.auth.getCurrentUser();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
