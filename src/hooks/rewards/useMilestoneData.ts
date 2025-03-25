
import { useState, useEffect } from 'react';
import { milestoneDataService } from "@/services/milestone/milestone-data-service";
import { rewardsService } from "@/services/milestone/rewards-service";
import { UserMilestone, MilestoneProgress, AvailableReward } from '@/types/api';

/**
 * Hook for fetching milestone data
 * 
 * This hook is responsible for:
 * - Fetching user milestones
 * - Fetching milestone progress data
 * - Fetching available rewards
 * - Calculating total points
 * 
 * @param userId - The ID of the user whose milestones to fetch
 * @returns Object containing milestone data and loading state
 */
export function useMilestoneData(userId: string | null | undefined) {
  const [milestones, setMilestones] = useState<UserMilestone[]>([]);
  const [availableRewards, setAvailableRewards] = useState<AvailableReward[]>([]);
  const [progress, setProgress] = useState<MilestoneProgress[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches all milestone data for the user
   */
  const fetchData = async () => {
    if (!userId) return;
    setIsLoading(true);
    
    try {
      // Use Promise.all to fetch all data in parallel for better performance
      const [milestonesData, progressData, rewardsData, pointsTotal] = await Promise.all([
        milestoneDataService.getUserMilestones(userId),
        milestoneDataService.getUserMilestoneProgress(userId),
        rewardsService.getAvailableRewards(userId),
        milestoneDataService.calculateTotalPoints(userId)
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
    refreshData: fetchData
  };
}
