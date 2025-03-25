
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

export function useCheckoutAuth() {
  const [userId, setUserId] = useState<string | null>(null);

  const { data: userData } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      return await apiClient.auth.getCurrentUser();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (userData?.user?.id) {
      setUserId(userData.user.id);
    }
  }, [userData]);

  return { userId };
}
