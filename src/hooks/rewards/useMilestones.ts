
import { useRewards } from './useRewards';
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
  const {
    allMilestones,
    activeMilestones,
    completedMilestones,
    availableRewards,
    totalPoints,
    isLoading,
    claimReward,
    refreshRewardsData
  } = useRewards(userId || undefined);

  return {
    milestones: allMilestones,
    progress: activeMilestones,
    completedMilestones,
    availableRewards,
    totalPoints,
    isLoading,
    claimReward,
    refreshData: refreshRewardsData
  };
}

// Export the types for use in other components
export type { UserMilestone, MilestoneProgress, AvailableReward };
