
import { useState, useEffect } from "react";
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
  const [error, setError] = useState<Error | null>(null);
  const [isClaimingReward, setIsClaimingReward] = useState(false);

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
      setError(null);
    } catch (err) {
      console.error('Error fetching milestone data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching milestone data'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Claims a reward for the user
   */
  const claimReward = async (milestoneId: string) => {
    if (!userId) return false;
    setIsClaimingReward(true);
    
    try {
      const success = await milestoneService.claimReward(userId, milestoneId);
      if (success) {
        // Refresh data after successful claim
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error claiming reward:', err);
      return false;
    } finally {
      setIsClaimingReward(false);
    }
  };

  // Load all data when component mounts or userId changes
  useEffect(() => {
    fetchData();
  }, [userId]);

  // Filter milestones into active/completed
  const activeMilestones = milestones.filter(milestone => !milestone.is_completed);
  const completedMilestones = milestones.filter(milestone => milestone.is_completed);

  return {
    milestones,
    progress,
    activeMilestones,
    completedMilestones,
    availableRewards,
    totalPoints,
    isLoading,
    error,
    claimReward,
    isClaimingReward,
    refreshData: fetchData
  };
}

// Export the types for use in other components
export type { UserMilestone, MilestoneProgress, AvailableReward };
