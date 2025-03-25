
import { useQuery } from "@tanstack/react-query";
import { milestoneDataService } from '@/services/milestone/milestone-data-service';
import { userActivityService } from '@/services/milestone/user-activity-service';

/**
 * Hook for fetching user milestone data
 * 
 * Fetches milestones and user activities, and calculates total points
 * Uses optimized caching strategy with proper query keys for selective invalidation
 * 
 * @param userId User ID to fetch milestones for
 * @param options Optional configuration options
 * @returns Object containing milestone data, total points, loading state and error
 */
export const useUserMilestones = (
  userId: string | undefined,
  options = { staleTime: 5 * 60 * 1000 } // 5 minutes default
) => {
  const milestonesQuery = useQuery({
    queryKey: ['milestones', { userId }],
    queryFn: async () => {
      if (!userId) return [];
      return await milestoneDataService.getUserMilestones(userId);
    },
    enabled: !!userId,
    staleTime: options.staleTime,
    placeholderData: [], // Provide placeholder data to avoid null checks
  });

  const activitiesQuery = useQuery({
    queryKey: ['activities', { userId }],
    queryFn: async () => {
      if (!userId) return [];
      return await userActivityService.getUserActivities(userId);
    },
    enabled: !!userId,
    staleTime: options.staleTime,
    placeholderData: [], // Provide placeholder data
  });

  // Calculate total points from activities
  const totalPoints = activitiesQuery.data?.reduce(
    (sum, activity) => sum + (activity.points_earned || 0), 
    0
  ) || 0;

  // Combined loading states
  const isLoading = milestonesQuery.isLoading || activitiesQuery.isLoading;
  const isFetching = milestonesQuery.isFetching || activitiesQuery.isFetching;
  
  return {
    milestonesData: milestonesQuery.data || [],
    totalPoints,
    isLoading, // Any data is loading initially
    isFetching, // Any data is being fetched (background or initial)
    isRefetching: milestonesQuery.isRefetching || activitiesQuery.isRefetching,
    milestonesLoading: milestonesQuery.isLoading, // Milestone-specific loading
    activitiesLoading: activitiesQuery.isLoading, // Activities-specific loading
    isInitialLoading: isLoading && (!milestonesQuery.isFetched || !activitiesQuery.isFetched),
    isSuccess: milestonesQuery.isSuccess && activitiesQuery.isSuccess,
    isError: milestonesQuery.isError || activitiesQuery.isError,
    error: milestonesQuery.error || activitiesQuery.error,
    isEmpty: (milestonesQuery.data?.length || 0) === 0,
    refetch: () => {
      milestonesQuery.refetch();
      activitiesQuery.refetch();
    }
  };
};
