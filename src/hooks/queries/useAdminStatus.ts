
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

export const useAdminStatus = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['admin', { userId }],
    queryFn: async () => {
      if (!userId) return false;
      return await apiClient.admin.checkAdminStatus(userId);
    },
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
