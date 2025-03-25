
import { supabaseClient } from "../supabase-client";
import { AvailableReward, PaymentProcessParams } from "@/types/api";

/**
 * Milestones API Client
 */
export const milestonesClient = {
  /**
   * Get user milestones
   */
  getUserMilestones: async (userId: string) => {
    if (!userId) return [];
    
    const { data, error } = await supabaseClient
      .from('user_milestones')
      .select('*, milestone:milestone_id(*)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Get user activities
   */
  getUserActivities: async (userId: string) => {
    if (!userId) return [];
    
    const { data, error } = await supabaseClient
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Get available rewards
   */
  getAvailableRewards: async (userId: string): Promise<AvailableReward[]> => {
    if (!userId) return [];
    
    const { data, error } = await supabaseClient.rpc('get_user_available_rewards', {
      p_user_id: userId
    });
    
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Get milestone icons
   */
  getMilestoneIcons: async (milestoneIds: string[]): Promise<{id: string, icon: string}[]> => {
    if (!milestoneIds.length) return [];
    
    const { data, error } = await supabaseClient
      .from('milestones')
      .select('id, icon')
      .in('id', milestoneIds);
    
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Update milestone progress
   */
  updateMilestoneProgress: async (params: PaymentProcessParams) => {
    const { data, error } = await supabaseClient.rpc('update_user_milestone_progress', {
      p_user_id: params.userId,
      p_points: params.points,
      p_activity_type: params.activityType,
      p_reference_id: params.referenceId,
      p_reference_type: params.referenceType
    });
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Claim a reward
   */
  claimReward: async (userId: string, milestoneId: string) => {
    const { data, error } = await supabaseClient
      .from('user_milestones')
      .update({ reward_claimed: true, claimed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('milestone_id', milestoneId);
    
    if (error) throw error;
    return data;
  }
};
