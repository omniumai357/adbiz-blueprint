
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/services/api/supabase-client";

export const useAdminStatus = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['admin', { userId }],
    queryFn: async () => {
      if (!userId) return false;
      return await supabaseClient.admin.checkAdminStatus(userId);
    },
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
