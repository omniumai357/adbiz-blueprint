
import { useQuery } from "@tanstack/react-query";
import { milestoneDataService } from '@/services/milestone/milestone-data-service';
import { userActivityService } from '@/services/milestone/user-activity-service';

/**
 * Hook for fetching user milestone data
 * 
 * Fetches milestones and user activities, and calculates total points
 * 
 * @param userId User ID to fetch milestones for
 * @returns Object containing milestone data, total points, loading state and error
 */
export const useUserMilestones = (userId: string | undefined) => {
  const milestonesQuery = useQuery({
    queryKey: ['milestones', { userId }],
    queryFn: async () => {
      if (!userId) return [];
      return await milestoneDataService.getUserMilestones(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const activitiesQuery = useQuery({
    queryKey: ['activities', { userId }],
    queryFn: async () => {
      if (!userId) return [];
      return await userActivityService.getUserActivities(userId);
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
