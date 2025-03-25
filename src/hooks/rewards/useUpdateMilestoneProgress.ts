
import { supabase } from '@/integrations/supabase/client';

/**
 * Parameters for updating milestone progress
 */
interface UpdateMilestoneProgressParams {
  /**
   * ID of the user whose progress to update
   */
  userId: string;
  
  /**
   * Number of points to award
   */
  points: number;
  
  /**
   * Type of activity that earned the points (e.g., 'order_completed', 'review_submitted')
   */
  activityType: string;
  
  /**
   * Optional ID of the related entity (e.g., order ID, review ID)
   */
  referenceId?: string;
  
  /**
   * Optional type of the reference entity (e.g., 'order', 'review')
   */
  referenceType?: string;
}

/**
 * Hook for updating user milestone progress
 * 
 * Provides a function to update a user's progress toward milestones
 * by adding points for completed activities.
 * 
 * @returns Object with the updateProgress function
 * 
 * @example
 * const { updateProgress } = useUpdateMilestoneProgress();
 * 
 * // Award points for completing an order
 * await updateProgress({
 *   userId: user.id,
 *   points: 100,
 *   activityType: 'order_completed',
 *   referenceId: orderId,
 *   referenceType: 'order'
 * });
 */
export function useUpdateMilestoneProgress() {
  /**
   * Updates a user's milestone progress by adding points
   * 
   * Calls the update_user_milestone_progress RPC function in Supabase
   * which:
   * 1. Records the activity in user_activities
   * 2. Updates the points in user_milestones
   * 3. Marks milestones as completed when thresholds are reached
   * 
   * @param params - Parameters for the update
   * @returns Object indicating success or failure
   */
  const updateProgress = async ({
    userId,
    points,
    activityType,
    referenceId,
    referenceType
  }: UpdateMilestoneProgressParams) => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase.rpc('update_user_milestone_progress', {
        p_user_id: userId,
        p_points: points,
        p_activity_type: activityType,
        p_reference_id: referenceId,
        p_reference_type: referenceType
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating milestone progress:', error);
      return { success: false, error };
    }
  };

  return { updateProgress };
}
