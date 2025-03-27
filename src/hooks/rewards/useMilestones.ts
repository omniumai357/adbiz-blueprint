
import { useState, useEffect } from "react";
import { apiClient } from "@/services/api/api-client";
import { UserMilestone as ApiUserMilestone } from "@/types/api";

// Define a unified UserMilestone type
export interface UserMilestone {
  id: string;
  user_id: string;
  milestone_id: string;
  milestone_name: string;
  current_points: number;
  points_target: number;
  is_completed: boolean;
  reward_claimed: boolean;
  reward_type: string;
  reward_value: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  claimed_at?: string;
  milestone_description?: string;
  icon?: string;
  milestone?: {
    points_required: number;
    name?: string;
    icon?: string;
  };
}

/**
 * Hook to manage milestone rewards for a user.
 * Fetches available milestones and handles reward application.
 * 
 * @param userId The current user's ID
 * @returns Object containing milestone state and handlers
 */
export function useMilestones(userId: string | undefined | null) {
  const [availableRewards, setAvailableRewards] = useState<UserMilestone[]>([]);
  const [milestones, setMilestones] = useState<UserMilestone[]>([]);
  const [completedMilestones, setCompletedMilestones] = useState<UserMilestone[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch user milestones and rewards
  useEffect(() => {
    const fetchMilestonesData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Fetch milestones
        const milestonesData = await apiClient.milestones.getUserMilestones(userId);
        setMilestones(milestonesData as unknown as UserMilestone[]);
        
        // Calculate completed milestones
        const completed = milestonesData.filter(
          (milestone: any) => milestone.is_completed
        );
        setCompletedMilestones(completed as unknown as UserMilestone[]);
        
        // Fetch available rewards
        const rewards = await apiClient.milestones.getAvailableRewards(userId);
        setAvailableRewards(rewards as unknown as UserMilestone[]);
        
        // Get total points
        const points = await apiClient.milestones.calculateTotalPoints(userId);
        setTotalPoints(points || 0);
      } catch (err) {
        console.error("Error fetching milestones:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestonesData();
  }, [userId]);

  // Claim a reward
  const claimReward = async (milestoneId: string) => {
    if (!userId) return false;
    
    try {
      const result = await apiClient.milestones.claimReward(userId, milestoneId);
      
      // Refresh data after claiming
      const rewards = await apiClient.milestones.getAvailableRewards(userId);
      setAvailableRewards(rewards as unknown as UserMilestone[]);
      
      return result;
    } catch (error) {
      console.error("Error claiming reward:", error);
      return false;
    }
  };

  // Refresh all data
  const refreshData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const milestonesData = await apiClient.milestones.getUserMilestones(userId);
      setMilestones(milestonesData as unknown as UserMilestone[]);
      
      const completed = milestonesData.filter(
        (milestone: any) => milestone.is_completed
      );
      setCompletedMilestones(completed as unknown as UserMilestone[]);
      
      const rewards = await apiClient.milestones.getAvailableRewards(userId);
      setAvailableRewards(rewards as unknown as UserMilestone[]);
      
      const points = await apiClient.milestones.calculateTotalPoints(userId);
      setTotalPoints(points || 0);
    } catch (err) {
      console.error("Error refreshing milestone data:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    milestones,
    totalPoints,
    completedMilestones,
    availableRewards,
    isLoading,
    error,
    claimReward,
    refreshData
  };
}
