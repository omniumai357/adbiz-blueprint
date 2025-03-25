
import { supabase } from "@/integrations/supabase/client";
import { AvailableReward } from "@/types/api";
import { MilestoneBaseService } from "./milestone-base-service";

/**
 * Service for managing rewards
 */
export class RewardsService extends MilestoneBaseService {
  /**
   * Get available unclaimed rewards for a user
   * @param userId ID of the user to fetch rewards for
   * @returns Promise resolving to an array of available rewards
   */
  async getAvailableRewards(userId: string): Promise<AvailableReward[]> {
    if (!userId) return [];
    
    try {
      // Call RPC function to get available rewards
      const { data, error } = await supabase
        .rpc('get_user_available_rewards', { p_user_id: userId });
      
      if (error) throw error;
      
      // Fetch milestone icons and add them to the rewards
      if (data && data.length > 0) {
        const milestoneIds = data.map((r: AvailableReward) => r.milestone_id);
        const icons = await this.getMilestoneIcons(milestoneIds);
        
        const iconMap = icons.reduce((map: Record<string, string>, m) => {
          map[m.id] = m.icon;
          return map;
        }, {});
        
        const rewardsWithIcons = data.map((reward: AvailableReward) => ({
          ...reward,
          icon: iconMap[reward.milestone_id]
        }));
        
        return rewardsWithIcons;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching available rewards:', error);
      throw error;
    }
  }
  
  /**
   * Claim a reward associated with a completed milestone
   * @param userId ID of the user claiming the reward
   * @param milestoneId ID of the milestone whose reward is being claimed
   * @returns Promise resolving to a boolean indicating success
   */
  async claimReward(userId: string, milestoneId: string): Promise<boolean> {
    if (!userId) return false;
    
    try {
      // Update the user_milestone record to mark the reward as claimed
      const { error } = await supabase
        .from('user_milestones')
        .update({
          reward_claimed: true,
          claimed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('milestone_id', milestoneId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error claiming reward:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const rewardsService = new RewardsService();
