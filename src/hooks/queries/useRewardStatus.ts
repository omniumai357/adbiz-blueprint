
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from '@/services/api/api-client';
import { toast } from "sonner";
import { useAppError } from '../error/useAppError';

/**
 * Hook for managing reward claim status
 * 
 * Provides functionality to claim rewards and track the claim status
 * Uses optimized caching strategy to reduce API calls and improve UX
 * 
 * @param userId User ID for the rewards
 * @returns Object with claim functionality and status
 */
export function useRewardStatus(userId: string | undefined) {
  const queryClient = useQueryClient();
  const { handleError } = useAppError();
  
  const claimRewardMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!userId) throw new Error("User not authenticated");
      return await apiClient.milestones.claimReward(userId, milestoneId);
    },
    onSuccess: () => {
      // Use focused invalidation to avoid unnecessary refetching
      queryClient.invalidateQueries({ queryKey: ['rewards', { userId }] });
      queryClient.invalidateQueries({ queryKey: ['milestones', { userId }] });
      
      // Notify the user
      toast.success("Reward claimed successfully!", {
        description: "Your reward has been added to your account."
      });
    },
    onError: (error) => {
      console.error("Failed to claim reward:", error);
      handleError(error, "Claiming reward");
    }
  });

  // Create a wrapper function that returns a Promise for compatibility with the RewardCard component
  const claimRewardWithPromise = (milestoneId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      claimRewardMutation.mutate(milestoneId, {
        onSuccess: (data) => resolve(data),
        onError: (error) => reject(error)
      });
    });
  };

  return {
    claimReward: claimRewardWithPromise,
    isClaimingReward: claimRewardMutation.isPending,
    claimError: claimRewardMutation.error,
    claimStatus: claimRewardMutation.status
  };
}
