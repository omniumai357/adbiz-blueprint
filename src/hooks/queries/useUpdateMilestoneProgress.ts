
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userActivityService } from '@/services/milestone/user-activity-service';
import { UpdateMilestoneProgressParams } from '@/services/milestone/milestone-service-types';

/**
 * Hook for updating user milestone progress
 * 
 * Provides a function to update a user's progress toward milestones
 * by adding points for completed activities.
 * 
 * @returns Object with the updateProgress function, loading state and error
 * 
 * @example
 * const { updateProgress, isUpdating } = useUpdateMilestoneProgress();
 * 
 * // Award points for completing an order
 * updateProgress({
 *   userId: user.id,
 *   points: 100,
 *   activityType: 'order_completed',
 *   referenceId: orderId,
 *   referenceType: 'order'
 * });
 */
export function useUpdateMilestoneProgress() {
  const queryClient = useQueryClient();
  
  const updateProgress = useMutation({
    mutationFn: async (params: UpdateMilestoneProgressParams) => {
      if (!params.userId) return { success: false };
      return await userActivityService.updateMilestoneProgress(params);
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['milestones', { userId: variables.userId }] });
      queryClient.invalidateQueries({ queryKey: ['activities', { userId: variables.userId }] });
      queryClient.invalidateQueries({ queryKey: ['rewards', { userId: variables.userId }] });
    }
  });

  return { 
    updateProgress: updateProgress.mutate,
    isUpdating: updateProgress.isPending,
    error: updateProgress.error
  };
}
