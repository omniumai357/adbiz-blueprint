
import { milestoneService } from '@/services/milestone/milestone-service';
import { UpdateMilestoneProgressParams } from '@/services/milestone/milestone-service-types';

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
   * @param params - Parameters for the update
   * @returns Object indicating success or failure
   */
  const updateProgress = async (params: UpdateMilestoneProgressParams) => {
    if (!params.userId) return { success: false };
    return await milestoneService.updateMilestoneProgress(params);
  };

  return { updateProgress };
}
