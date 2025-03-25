
import { supabase } from "@/integrations/supabase/client";
import { UserActivity } from "@/types/api";
import { 
  UpdateMilestoneProgressParams,
  MilestoneUpdateResult 
} from "./milestone-service-types";
import { MilestoneBaseService } from "./milestone-base-service";

/**
 * Service for user activity management
 */
export class UserActivityService extends MilestoneBaseService {
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
}

// Create a singleton instance
export const userActivityService = new UserActivityService();
