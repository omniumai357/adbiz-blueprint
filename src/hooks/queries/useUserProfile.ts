
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";
import { Profile } from "@/types/api";

export const useUserProfile = (userId: string | undefined) => {
  return useQuery<Profile | null>({
    queryKey: ['profile', { userId }],
    queryFn: async () => {
      if (!userId) return null;
      return await apiClient.profiles.getProfile(userId);
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
