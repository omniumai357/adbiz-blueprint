
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

  // Transform UserMilestone[] into MilestoneProgress[]
  const milestoneProgress: MilestoneProgress[] = activeMilestones.map(milestone => ({
    milestone_id: milestone.milestone_id,
    milestone_name: milestone.milestone_name,
    points_required: milestone.milestone?.points_required || 0,
    current_points: milestone.current_points,
    progress_percentage: milestone.milestone?.points_required 
      ? Math.min(100, Math.round((milestone.current_points / milestone.milestone.points_required) * 100))
      : 0,
    icon: milestone.icon
  }));

  return {
    milestones: allMilestones,
    progress: milestoneProgress,
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
