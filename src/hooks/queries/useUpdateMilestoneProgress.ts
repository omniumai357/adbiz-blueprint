
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { milestoneService } from "@/services/milestone/milestone-service";
import { UpdateMilestoneProgressParams } from '@/services/milestone/milestone-service-types';
import { toast } from "sonner";

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

  /**
   * Update user milestone progress with optional success notification
   */
  const updateProgressWithNotification = (
    params: UpdateMilestoneProgressParams, 
    showSuccessToast = false
  ) => {
    updateMutation.mutate(params, {
      onSuccess: () => {
        if (showSuccessToast) {
          toast.success("Progress updated", {
            description: `You earned ${params.points} points!`
          });
        }
      }
    });
  };

  return { 
    updateProgress: updateMutation.mutate,
    updateProgressWithNotification,
    updateProgressAsync: updateMutation.mutateAsync, // For awaiting the result
    isUpdating: updateMutation.isPending,
    isSuccess: updateMutation.isSuccess,
    isError: updateMutation.isError,
    error: updateMutation.error,
    status: updateMutation.status,
    reset: updateMutation.reset
  };
}
