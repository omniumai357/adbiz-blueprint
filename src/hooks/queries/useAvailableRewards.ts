
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardsService } from '@/services/milestone/rewards-service';
import { AvailableReward } from "@/types/api";

export const useAvailableRewards = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const rewardsQuery = useQuery({
    queryKey: ['rewards', { userId }],
    queryFn: async (): Promise<AvailableReward[]> => {
      if (!userId) return [];
      return await rewardsService.getAvailableRewards(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const claimRewardMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!userId) throw new Error("User not authenticated");
      return await rewardsService.claimReward(userId, milestoneId);
    },
    onSuccess: () => {
      // Invalidate rewards query to refresh data
      queryClient.invalidateQueries({ queryKey: ['rewards', { userId }] });
    }
  });

  return {
    rewards: rewardsQuery.data || [],
    isLoading: rewardsQuery.isLoading,
    error: rewardsQuery.error,
    claimReward: claimRewardMutation.mutate,
    isClaimingReward: claimRewardMutation.isPending
  };
};
