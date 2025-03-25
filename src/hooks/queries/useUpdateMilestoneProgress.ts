
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

interface UpdateMilestoneProgressParams {
  userId: string;
  points: number;
  activityType: string;
  referenceId?: string;
  referenceType?: string;
}

export function useUpdateMilestoneProgress() {
  const queryClient = useQueryClient();
  
  const updateProgress = useMutation({
    mutationFn: async (params: UpdateMilestoneProgressParams) => {
      if (!params.userId) return { success: false };
      return await apiClient.milestones.updateMilestoneProgress(params);
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
