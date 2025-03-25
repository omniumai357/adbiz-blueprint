
import { supabase } from "@/integrations/supabase/client";
import {
  MilestoneServiceInterface,
  UpdateMilestoneProgressParams,
  MilestoneUpdateResult
} from "./milestone-service-types";
import { 
  UserMilestone, 
  MilestoneProgress, 
  AvailableReward,
  UserActivity
} from "@/types/api";

/**
 * Milestone service for managing user milestone progress and rewards
 * 
 * This service handles all interactions with the milestone-related tables
 * in the database, providing a clean interface for other parts of the application
 * to work with milestone data.
 */
export class MilestoneService implements MilestoneServiceInterface {
  /**
   * Get all milestones for a specific user
   * @param userId ID of the user to fetch milestones for
   * @returns Promise resolving to an array of user milestones
   */
  async getUserMilestones(userId: string): Promise<UserMilestone[]> {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('user_milestones')
        .select('*, milestone:milestone_id(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Transform the data to match the UserMilestone type expected structure
      const transformedData: UserMilestone[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        milestone_id: item.milestone_id,
        current_points: item.current_points,
        is_completed: item.is_completed,
        reward_claimed: item.reward_claimed,
        completed_at: item.completed_at,
        claimed_at: item.claimed_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        milestone: item.milestone,
        // Add the required fields from the milestone for the UserMilestone interface
        milestone_name: item.milestone?.name || '',
        milestone_description: item.milestone?.description,
        reward_type: item.milestone?.reward_type || '',
        reward_value: item.milestone?.reward_value || 0,
        icon: item.milestone?.icon
      }));
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching user milestones:', error);
      throw error;
    }
  }
  
  /**
   * Get user progress towards milestones
   * @param userId ID of the user to fetch progress for
   * @returns Promise resolving to an array of milestone progress objects
   */
  async getUserMilestoneProgress(userId: string): Promise<MilestoneProgress[]> {
    if (!userId) return [];
    
    try {
      // Get user milestone progress
      const { data: userMilestones, error: progressError } = await supabase
        .from('user_milestones')
        .select(`
          milestone_id,
          current_points,
          milestones (
            name,
            points_required,
            icon
          )
        `)
        .eq('user_id', userId);
      
      if (progressError) throw progressError;
      
      // Format progress data
      const progressData = userMilestones?.map(um => ({
        milestone_id: um.milestone_id,
        milestone_name: um.milestones?.name || '',
        points_required: um.milestones?.points_required || 0,
        current_points: um.current_points,
        progress_percentage: Math.min(100, Math.round((um.current_points / (um.milestones?.points_required || 1)) * 100)),
        icon: um.milestones?.icon
      })) || [];
      
      return progressData;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }
  
  /**
   * Get user activity history
   * @param userId ID of the user to fetch activities for
   * @returns Promise resolving to an array of user activities
   */
  async getUserActivities(userId: string): Promise<UserActivity[]> {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  }
  
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
   * Get milestone icons for a set of milestone IDs
   * @param milestoneIds Array of milestone IDs to fetch icons for
   * @returns Promise resolving to an array of objects with ID and icon
   */
  async getMilestoneIcons(milestoneIds: string[]): Promise<{id: string, icon: string}[]> {
    if (!milestoneIds.length) return [];
    
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('id, icon')
        .in('id', milestoneIds);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching milestone icons:', error);
      throw error;
    }
  }
  
  /**
   * Update a user's progress towards milestones
   * @param params Parameters for updating milestone progress
   * @returns Promise resolving to a result object indicating success or failure
   */
  async updateMilestoneProgress(params: UpdateMilestoneProgressParams): Promise<MilestoneUpdateResult> {
    if (!params.userId) return { success: false };

    try {
      const { error } = await supabase.rpc('update_user_milestone_progress', {
        p_user_id: params.userId,
        p_points: params.points,
        p_activity_type: params.activityType,
        p_reference_id: params.referenceId,
        p_reference_type: params.referenceType
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating milestone progress:', error);
      return { success: false, error };
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
  
  /**
   * Calculate total points earned by a user
   * @param userId ID of the user to calculate points for
   * @returns Promise resolving to the total points
   */
  async calculateTotalPoints(userId: string): Promise<number> {
    if (!userId) return 0;
    
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('points_earned')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return data?.reduce((sum, activity) => sum + (activity.points_earned || 0), 0) || 0;
    } catch (error) {
      console.error('Error calculating total points:', error);
      return 0;
    }
  }
}

// Create a singleton instance
export const milestoneService = new MilestoneService();
