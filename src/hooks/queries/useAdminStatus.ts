
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

/**
 * Custom hook to check if the current user has admin status
 * 
 * Uses React Query to fetch and cache the admin status for a user.
 * The query is only enabled when a valid userId is provided and
 * results are cached for 30 minutes to minimize unnecessary API calls.
 * 
 * @param {string | undefined} userId - The ID of the user to check admin status for
 * @returns {Object} React Query result object containing admin status data
 */
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
