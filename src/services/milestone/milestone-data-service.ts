
import { supabase } from "@/integrations/supabase/client";
import { UserMilestone, MilestoneProgress } from "@/types/api";
import { MilestoneBaseService } from "./milestone-base-service";

/**
 * Service for retrieving milestone data
 */
export class MilestoneDataService extends MilestoneBaseService {
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
export const milestoneDataService = new MilestoneDataService();
