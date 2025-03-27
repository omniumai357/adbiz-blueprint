import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  name?: string; // For backward compatibility
  discount?: number; // For backward compatibility
}

/**
 * Hook to manage milestone rewards for a user.
 * Fetches available milestones and handles reward application.
 * 
 * @param userId The current user's ID
 * @param total The current order total
 * @returns Object containing milestone state and handlers
 */
export function useMilestoneRewards(userId: string | undefined, total: number) {
  const [availableMilestones, setAvailableMilestones] = useState<UserMilestone[]>([]);
  const [appliedMilestoneReward, setAppliedMilestoneReward] = useState<UserMilestone | null>(null);
  const [milestoneRewardAmount, setMilestoneRewardAmount] = useState<number>(0);

  // Fetch available milestones for the user
  useEffect(() => {
    const fetchMilestones = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from<UserMilestone>('user_milestones')
          .select('*')
          .eq('user_id', userId)
          .eq('is_completed', true)
          .eq('reward_claimed', false);

        if (error) {
          console.error("Error fetching milestones:", error);
          return;
        }

        setAvailableMilestones(data || []);
      } catch (error) {
        console.error("Error fetching milestones:", error);
      }
    };

    fetchMilestones();
  }, [userId]);

  // Apply a milestone reward
  const handleMilestoneRewardApplied = (reward: UserMilestone) => {
    setAppliedMilestoneReward(reward);
  };

  // Calculate milestone reward amount
  const calculateMilestoneRewardAmount = (subtotal: number) => {
    if (appliedMilestoneReward) {
      return subtotal * (appliedMilestoneReward.reward_value / 100);
    }
    return 0;
  };

  // Award milestone points
  const awardMilestonePoints = async (orderId: string, orderTotal: number) => {
    if (!userId) return;

    try {
      // Simulate awarding points (replace with actual logic)
      console.log(`Awarding ${orderTotal} points to user ${userId} for order ${orderId}`);
    } catch (error) {
      console.error("Error awarding milestone points:", error);
    }
  };

  return {
    availableMilestones,
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    calculateMilestoneRewardAmount,
    awardMilestonePoints,
  };
}
