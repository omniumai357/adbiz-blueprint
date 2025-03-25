
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";
import { AvailableReward } from "@/types/api";

export const useAvailableRewards = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const rewardsQuery = useQuery({
    queryKey: ['rewards', { userId }],
    queryFn: async (): Promise<AvailableReward[]> => {
      if (!userId) return [];
      const rewards = await apiClient.milestones.getAvailableRewards(userId);
      
      if (rewards.length > 0) {
        // Fetch milestone icons
        const milestoneIds = rewards.map((r: AvailableReward) => r.milestone_id);
        const icons = await apiClient.milestones.getMilestoneIcons(milestoneIds);
        
        // Map icons to rewards
        const iconMap = (icons || []).reduce((map: Record<string, string>, m) => {
          map[m.id] = m.icon;
          return map;
        }, {});
        
        // Add icons to rewards
        return rewards.map((reward: AvailableReward) => ({
          ...reward,
          icon: iconMap[reward.milestone_id]
        }));
      }
      
      return rewards;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const claimRewardMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!userId) throw new Error("User not authenticated");
      return await apiClient.milestones.claimReward(userId, milestoneId);
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
