
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

export const useUserOrders = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['orders', { userId }],
    queryFn: async () => {
      if (!userId) return [];
      return await apiClient.orders.getUserOrders(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
