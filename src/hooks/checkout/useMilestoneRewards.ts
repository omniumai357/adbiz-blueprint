
import { useState } from "react";
import { UserMilestone } from "@/types/api";
import { useUpdateMilestoneProgress } from "@/hooks/queries/useUpdateMilestoneProgress";

/**
 * Hook for managing milestone rewards in the checkout process
 *
 * Handles application of milestone rewards and calculates discount amounts
 * Also handles awarding points for completed orders
 * 
 * @param userId User ID to apply rewards for
 * @param subtotal Current order subtotal
 * @returns Milestone rewards management functions and state
 */
export function useMilestoneRewards(userId: string | null | undefined, subtotal: number) {
  const [appliedMilestoneReward, setAppliedMilestoneReward] = useState<UserMilestone | null>(null);
  const { updateProgress } = useUpdateMilestoneProgress();

  /**
   * Apply a milestone reward to the current order
   */
  const handleMilestoneRewardApplied = (reward: UserMilestone) => {
    setAppliedMilestoneReward(reward);
  };

  /**
   * Calculate the discount amount based on the applied reward
   */
  const calculateMilestoneRewardAmount = (): number => {
    if (!appliedMilestoneReward) return 0;
    
    if (appliedMilestoneReward.reward_type === 'discount_percentage') {
      return (subtotal * appliedMilestoneReward.reward_value) / 100;
    } else {
      return Math.min(subtotal, appliedMilestoneReward.reward_value);
    }
  };

  /**
   * Award points for an order completion
   * @param orderId - ID of the completed order
   * @param orderAmount - Total amount of the order
   */
  const awardMilestonePoints = async (orderId: string, orderAmount: number) => {
    if (!userId) return;
    
    // Base points for completing an order (1 point per $1 spent)
    const basePoints = Math.floor(orderAmount);
    
    await updateProgress({
      userId,
      points: basePoints,
      activityType: 'order_completed',
      referenceId: orderId,
      referenceType: 'order'
    });
  };

  return {
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    calculateMilestoneRewardAmount,
    awardMilestonePoints
  };
}
