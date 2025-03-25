
import { useQuery } from "@tanstack/react-query";
import { rewardsService } from '@/services/milestone/rewards-service';
import { AvailableReward } from "@/types/api";
import { useRewardStatus } from "./useRewardStatus";

/**
 * Hook for fetching and managing available rewards
 * 
 * Fetches available rewards and provides functionality to claim them
 * 
 * @param userId User ID to fetch rewards for
 * @returns Object containing rewards data, loading state, error, and claim functionality
 */
export const useAvailableRewards = (userId: string | undefined) => {
  const rewardsQuery = useQuery({
    queryKey: ['rewards', { userId }],
    queryFn: async (): Promise<AvailableReward[]> => {
      if (!userId) return [];
      return await rewardsService.getAvailableRewards(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { claimReward, isClaimingReward, claimError } = useRewardStatus(userId);

  return {
    rewards: rewardsQuery.data || [],
    isLoading: rewardsQuery.isLoading,
    error: rewardsQuery.error || claimError,
    claimReward,
    isClaimingReward
  };
};
