
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/ui/use-toast";
import { milestoneService } from "@/services/milestone/milestone-service";
import { UserMilestone, MilestoneProgress, AvailableReward } from '@/types/api';

/**
 * Hook for managing user milestones and rewards
 * 
 * Provides functionality to:
 * - Fetch all active milestones in the system
 * - Track user progress toward milestones
 * - Manage available rewards
 * - Claim rewards
 * 
 * @param userId - The ID of the user whose milestones to manage
 * @returns Object containing milestone data, rewards, and functions to interact with them
 */
export function useMilestones(userId: string | null | undefined) {
  const [milestones, setMilestones] = useState<UserMilestone[]>([]);
  const [availableRewards, setAvailableRewards] = useState<AvailableReward[]>([]);
  const [progress, setProgress] = useState<MilestoneProgress[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Fetches all milestone data for the user
   */
  const fetchData = async () => {
    if (!userId) return;
    setIsLoading(true);
    
    try {
      // Use Promise.all to fetch all data in parallel for better performance
      const [milestonesData, progressData, rewardsData, pointsTotal] = await Promise.all([
        milestoneService.getUserMilestones(userId),
        milestoneService.getUserMilestoneProgress(userId),
        milestoneService.getAvailableRewards(userId),
        milestoneService.calculateTotalPoints(userId)
      ]);
      
      setMilestones(milestonesData);
      setProgress(progressData);
      setAvailableRewards(rewardsData);
      setTotalPoints(pointsTotal);
    } catch (error) {
      console.error('Error fetching milestone data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Claims a reward for the user
   * 
   * @param milestoneId - The ID of the milestone whose reward to claim
   * @returns The claimed reward, or null if claiming failed
   */
  const claimReward = async (milestoneId: string) => {
    if (!userId) return;
    
    try {
      const success = await milestoneService.claimReward(userId, milestoneId);
      
      if (!success) throw new Error("Failed to claim reward");
      
      // Remove the claimed reward from the available rewards list
      setAvailableRewards(prev => prev.filter(r => r.milestone_id !== milestoneId));
      
      // Find the reward to show details in the toast
      const reward = availableRewards.find(r => r.milestone_id === milestoneId);
      
      toast({
        title: "Reward Claimed!",
        description: `You've claimed a ${reward?.reward_value}${reward?.reward_type === 'discount_percentage' ? '%' : '$'} discount. It will be applied to your next purchase.`,
      });
      
      return reward;
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to claim reward. Please try again.",
      });
      return null;
    }
  };

  // Load all data when component mounts or userId changes
  useEffect(() => {
    fetchData();
  }, [userId]);

  return {
    milestones,
    progress,
    availableRewards,
    totalPoints,
    isLoading,
    claimReward,
    refreshData: fetchData
  };
}
