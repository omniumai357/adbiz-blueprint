
import { useAvailableRewards } from "@/hooks/queries/useAvailableRewards";
import { useUserMilestones } from "@/hooks/queries/useUserMilestones";
import { useRewardStatus } from "@/hooks/queries/useRewardStatus";
import { AvailableReward, UserMilestone } from "@/types/api";

/**
 * Unified hook for managing user rewards
 *
 * Provides a consolidated API for:
 * - Getting available rewards
 * - Claiming rewards
 * - Accessing milestone progress data
 * - Accessing total earned points
 * 
 * @param userId User ID to fetch rewards for
 * @returns Consolidated rewards data and functionality
 */
export function useRewards(userId: string | undefined) {
  const { milestonesData, totalPoints, isLoading: isMilestonesLoading } = useUserMilestones(userId);
  
  const { 
    rewards, 
    isLoading: isRewardsLoading, 
    claimReward, 
    isClaimingReward,
    refetch 
  } = useAvailableRewards(userId);

  // Filter milestones into active/completed
  const activeMilestones = milestonesData.filter(
    milestone => !milestone.is_completed
  );
  
  const completedMilestones = milestonesData.filter(
    milestone => milestone.is_completed
  );

  return {
    // Milestone data
    activeMilestones,
    completedMilestones,
    allMilestones: milestonesData,
    totalPoints,
    
    // Rewards data
    availableRewards: rewards,
    
    // Actions
    claimReward,
    
    // Loading states
    isLoading: isMilestonesLoading || isRewardsLoading,
    isClaimingReward,
    
    // Utilities
    refreshRewardsData: refetch
  };
}

export type { AvailableReward, UserMilestone };
