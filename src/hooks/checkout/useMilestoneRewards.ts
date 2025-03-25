
import { useState } from "react";
import { UserMilestone } from "@/types/api";
import { useUpdateMilestoneProgress } from "@/hooks/queries/useUpdateMilestoneProgress";
import { toast } from "sonner";

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
    toast.success("Reward applied", {
      description: `${reward.reward_description || "Discount"} has been applied to your order.`
    });
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
    if (!userId) return false;
    
    try {
      // Base points for completing an order (1 point per $1 spent)
      const basePoints = Math.floor(orderAmount);
      
      await updateProgress({
        userId,
        points: basePoints,
        activityType: 'order_completed',
        referenceId: orderId,
        referenceType: 'order'
      });
      
      toast.success("Points awarded!", {
        description: `You earned ${basePoints} points for your purchase.`
      });
      
      return true;
    } catch (error) {
      console.error("Failed to award milestone points:", error);
      toast.error("Failed to award points", {
        description: "Your purchase was successful, but we couldn't award points at this time."
      });
      return false;
    }
  };

  return {
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    calculateMilestoneRewardAmount,
    awardMilestonePoints
  };
}
