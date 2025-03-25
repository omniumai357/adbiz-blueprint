
import { useMilestoneData } from './useMilestoneData';
import { useRewardActions } from './useRewardActions';
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
    milestones,
    progress,
    availableRewards,
    totalPoints,
    isLoading,
    refreshData
  } = useMilestoneData(userId);

  const { claimReward, isProcessing } = useRewardActions(userId, refreshData);

  return {
    milestones,
    progress,
    availableRewards,
    totalPoints,
    isLoading: isLoading || isProcessing,
    claimReward,
    refreshData
  };
}

// Export the types for use in other components
export type { UserMilestone, MilestoneProgress, AvailableReward };
