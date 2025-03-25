
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

export function useCheckoutAuth() {
  const [userId, setUserId] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      const userData = await apiClient.auth.getCurrentUser();
      return userData?.user || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  return { userId };
}
