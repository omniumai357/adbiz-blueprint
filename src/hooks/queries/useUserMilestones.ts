
import { useQuery } from "@tanstack/react-query";
import { milestoneService } from '@/services/milestone/milestone-service';

export const useUserMilestones = (userId: string | undefined) => {
  const milestonesQuery = useQuery({
    queryKey: ['milestones', { userId }],
    queryFn: async () => {
      if (!userId) return [];
      return await milestoneService.getUserMilestones(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const activitiesQuery = useQuery({
    queryKey: ['activities', { userId }],
    queryFn: async () => {
      if (!userId) return [];
      return await milestoneService.getUserActivities(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const totalPoints = activitiesQuery.data?.reduce(
    (sum, activity) => sum + (activity.points_earned || 0), 
    0
  ) || 0;

  return {
    milestonesData: milestonesQuery.data || [],
    totalPoints,
    isLoading: milestonesQuery.isLoading || activitiesQuery.isLoading,
    error: milestonesQuery.error || activitiesQuery.error
  };
};
