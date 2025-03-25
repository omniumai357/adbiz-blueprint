
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
    retry: 2,
    placeholderData: [], // Provide placeholder data to prevent null checks
  });
  
  const { 
    claimReward, 
    isClaimingReward, 
    claimError, 
    claimStatus, 
    isLoading: isClaimLoading 
  } = useRewardStatus(userId);

  return {
    rewards: rewardsQuery.data || [],
    isLoading: rewardsQuery.isLoading,
    isInitialLoading: rewardsQuery.isLoading && !rewardsQuery.isFetched, // For initial load vs. refetch
    isFetching: rewardsQuery.isFetching, // When refreshing data in background
    isRefetching: rewardsQuery.isRefetching, // When manually triggered refresh
    isSuccess: rewardsQuery.isSuccess,
    isError: rewardsQuery.isError,
    error: rewardsQuery.error || claimError,
    isEmpty: (rewardsQuery.data?.length || 0) === 0,
    claimReward,
    isClaimingReward,
    isProcessing: isClaimingReward || rewardsQuery.isFetching, // Combined loading state
    claimStatus,
    refetch: rewardsQuery.refetch
  };
};
