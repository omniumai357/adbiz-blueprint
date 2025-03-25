
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/services/api/supabase-client";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      return await supabaseClient.auth.getUser();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
