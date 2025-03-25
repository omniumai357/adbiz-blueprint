
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/services/api/supabase-client";

export const useUserOrders = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['orders', { userId }],
    queryFn: async () => {
      if (!userId) return [];
      return await supabaseClient.orders.getOrdersByUserId(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
