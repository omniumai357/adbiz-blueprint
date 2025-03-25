
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/services/api/supabase-client";

export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', { userId }],
    queryFn: async () => {
      if (!userId) return null;
      return await supabaseClient.profiles.getProfileById(userId);
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
