
import { useState } from "react";
import { UserMilestone } from "@/types/api";
import { useUpdateMilestoneProgress } from "@/hooks/queries/useUpdateMilestoneProgress";

export function useMilestoneRewards(userId: string | null | undefined, subtotal: number) {
  const [appliedMilestoneReward, setAppliedMilestoneReward] = useState<UserMilestone | null>(null);
  const { updateProgress } = useUpdateMilestoneProgress();

  const handleMilestoneRewardApplied = (reward: UserMilestone) => {
    setAppliedMilestoneReward(reward);
  };

  const calculateMilestoneRewardAmount = (): number => {
    if (!appliedMilestoneReward) return 0;
    
    if (appliedMilestoneReward.reward_type === 'discount_percentage') {
      return (subtotal * appliedMilestoneReward.reward_value) / 100;
    } else {
      return Math.min(subtotal, appliedMilestoneReward.reward_value);
    }
  };

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
