
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', { userId }],
    queryFn: async () => {
      if (!userId) return null;
      return await apiClient.profiles.getProfile(userId);
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
