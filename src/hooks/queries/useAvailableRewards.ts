
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@/services/api/supabase-client";

export const useAvailableRewards = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const rewardsQuery = useQuery({
    queryKey: ['rewards', { userId }],
    queryFn: async () => {
      if (!userId) return [];
      const rewards = await supabaseClient.milestones.getAvailableRewards(userId);
      
      if (rewards.length > 0) {
        // Fetch milestone icons
        const milestoneIds = rewards.map((r: any) => r.milestone_id);
        const icons = await supabaseClient.milestones.getMilestoneIcons(milestoneIds);
        
        // Map icons to rewards
        const iconMap = (icons || []).reduce((map: Record<string, string>, m) => {
          map[m.id] = m.icon;
          return map;
        }, {});
        
        // Add icons to rewards
        return rewards.map((reward: any) => ({
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
      return await supabaseClient.milestones.claimReward(userId, milestoneId);
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
