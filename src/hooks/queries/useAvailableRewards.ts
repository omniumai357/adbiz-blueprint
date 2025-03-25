
import { useQuery } from "@tanstack/react-query";
import { apiClient } from '@/services/api/api-client';
import { AvailableReward } from "@/types/api";
import { useRewardStatus } from "./useRewardStatus";

/**
 * Hook for fetching and managing available rewards
 * 
 * Fetches available rewards and provides functionality to claim them
 * Uses optimized caching strategy with configurable stale time
 * 
 * @param userId User ID to fetch rewards for
 * @param options Optional configuration options
 * @returns Object containing rewards data, loading state, error, and claim functionality
 */
export const useAvailableRewards = (
  userId: string | undefined, 
  options = { staleTime: 5 * 60 * 1000 } // 5 minutes default stale time
) => {
  const rewardsQuery = useQuery({
    queryKey: ['rewards', { userId }],
    queryFn: async (): Promise<AvailableReward[]> => {
      if (!userId) return [];
      return await apiClient.milestones.getAvailableRewards(userId);
    },
    enabled: !!userId,
    staleTime: options.staleTime,
    retry: 2
  });
  
  const { claimReward, isClaimingReward, claimError, claimStatus } = useRewardStatus(userId);

  return {
    rewards: rewardsQuery.data || [],
    isLoading: rewardsQuery.isLoading,
    isSuccess: rewardsQuery.isSuccess,
    error: rewardsQuery.error || claimError,
    claimReward,
    isClaimingReward,
    claimStatus,
    refetch: rewardsQuery.refetch
  };
};
