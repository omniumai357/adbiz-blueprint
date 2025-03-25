
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

export function useCheckoutAuth() {
  const [userId, setUserId] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      const { data } = await apiClient.auth.getCurrentUser();
      return data.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data?.id) {
      setUserId(data.id);
    }
  }, [data]);

  return { userId };
}
