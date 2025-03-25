
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { milestoneService } from "@/services/milestone/milestone-service";
import { UpdateMilestoneProgressParams } from '@/services/milestone/milestone-service-types';

/**
 * Hook for updating user milestone progress
 * 
 * Provides a function to update a user's progress toward milestones
 * by adding points for completed activities.
 * Uses targeted cache invalidation to minimize API calls.
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
  
  const updateMutation = useMutation({
    mutationFn: async (params: UpdateMilestoneProgressParams) => {
      if (!params.userId) return { success: false };
      return await milestoneService.updateMilestoneProgress(params);
    },
    onSuccess: (_, variables) => {
      // Use targeted invalidation to avoid unnecessary API calls
      queryClient.invalidateQueries({ 
        queryKey: ['milestones', { userId: variables.userId }]
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['activities', { userId: variables.userId }]
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['rewards', { userId: variables.userId }]
      });
    }
  });

  return { 
    updateProgress: updateMutation.mutate,
    updateProgressAsync: updateMutation.mutateAsync, // For awaiting the result
    isUpdating: updateMutation.isPending,
    isSuccess: updateMutation.isSuccess,
    isError: updateMutation.isError,
    error: updateMutation.error,
    status: updateMutation.status,
    reset: updateMutation.reset
  };
}
