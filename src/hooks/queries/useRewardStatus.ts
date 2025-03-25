
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from '@/services/api/api-client';

/**
 * Hook for managing reward claim status
 * 
 * Provides functionality to claim rewards and track the claim status
 * 
 * @param userId User ID for the rewards
 * @returns Object with claim functionality and status
 */
export function useRewardStatus(userId: string | undefined) {
  const queryClient = useQueryClient();
  
  const claimRewardMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!userId) throw new Error("User not authenticated");
      return await apiClient.milestones.claimReward(userId, milestoneId);
    },
    onSuccess: () => {
      // Invalidate rewards query to refresh data
      queryClient.invalidateQueries({ queryKey: ['rewards', { userId }] });
      queryClient.invalidateQueries({ queryKey: ['milestones', { userId }] });
    },
    onError: (error) => {
      console.error("Failed to claim reward:", error);
    }
  });

  return {
    claimReward: claimRewardMutation.mutate,
    isClaimingReward: claimRewardMutation.isPending,
    claimError: claimRewardMutation.error,
    claimStatus: claimRewardMutation.status
  };
}
