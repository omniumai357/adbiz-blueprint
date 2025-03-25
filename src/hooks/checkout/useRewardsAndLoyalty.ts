
import { useState } from "react";
import { useMilestoneRewards } from "./useMilestoneRewards";
import { UserMilestone } from "../rewards/useMilestones";

export function useRewardsAndLoyalty(userId: string | undefined, total: number) {
  const [isLoyaltyProgramEnabled, setIsLoyaltyProgramEnabled] = useState<boolean>(false);
  const [loyaltyBonusAmount, setLoyaltyBonusAmount] = useState<number>(0);
  
  const { 
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    calculateMilestoneRewardAmount,
    awardMilestonePoints
  } = useMilestoneRewards(userId, total);

  const handleLoyaltyProgramToggle = () => {
    setIsLoyaltyProgramEnabled((prev) => !prev);
  };

  // We update the loyalty bonus amount based on the subtotal and whether the program is enabled
  const updateLoyaltyBonus = (subtotal: number) => {
    if (isLoyaltyProgramEnabled && userId) {
      setLoyaltyBonusAmount(subtotal * 0.05); // 5% loyalty bonus
    } else {
      setLoyaltyBonusAmount(0);
    }
  };

  const handleOrderSuccessWithRewards = async (orderId: string, orderTotal: number) => {
    if (userId) {
      await awardMilestonePoints(orderId, orderTotal);
    }
  };

  return {
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle,
    updateLoyaltyBonus,
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    handleOrderSuccessWithRewards,
  };
}
