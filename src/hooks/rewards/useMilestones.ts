
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/ui/use-toast';
import { logger } from '@/lib/utils/logging';

// Define the UserMilestone type that matches the database structure
export interface UserMilestone {
  id: string;
  user_id: string;
  milestone_id: string;
  milestone_name: string;
  description?: string;
  is_completed: boolean;
  reward_claimed: boolean;
  reward_type: 'discount_percentage' | 'discount_fixed' | 'bonus_feature';
  reward_value: number;
  current_points: number;
  points_target: number;
  claimed_at?: string | null;
  milestone_type?: string;
}

// Define a common milestone data type for sharing between components
export interface CommonMilestoneData {
  id: string;
  milestone_id: string;
  milestone_name: string;
  reward_type: 'discount_percentage' | 'discount_fixed' | 'bonus_feature';
  reward_value: number;
}

// Hook for managing user milestones
export function useMilestones(userId: string | null) {
  const [availableRewards, setAvailableRewards] = useState<UserMilestone[]>([]);
  const [milestones, setMilestones] = useState<UserMilestone[]>([]);
  const [completedMilestones, setCompletedMilestones] = useState<UserMilestone[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Function to refresh data
  const refreshData = async () => {
    if (!userId) return;
    fetchRewards();
  };

  // Fetch available rewards when userId changes
  const fetchRewards = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('user_milestones')
        .select('*')
        .eq('user_id', userId)
        .eq('is_completed', true)
        .eq('reward_claimed', false);
      
      if (fetchError) throw fetchError;
      
      // Transform the data to match the UserMilestone interface
      const transformedData: UserMilestone[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        milestone_id: item.milestone_id,
        milestone_name: item.milestone_name || `Milestone ${item.milestone_id}`,
        description: item.description,
        is_completed: item.is_completed,
        reward_claimed: item.reward_claimed,
        reward_type: item.reward_type || 'discount_percentage',
        reward_value: item.reward_value || 0,
        current_points: item.current_points || 0,
        points_target: item.points_target || 100,
        claimed_at: item.claimed_at,
        milestone_type: item.milestone_type
      }));
      
      setAvailableRewards(transformedData);
      
      // Also fetch all milestones for display
      const { data: allMilestones, error: milestonesError } = await supabase
        .from('user_milestones')
        .select('*')
        .eq('user_id', userId);
        
      if (milestonesError) throw milestonesError;
      
      // Transform all milestones
      const transformedMilestones: UserMilestone[] = (allMilestones || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        milestone_id: item.milestone_id,
        milestone_name: item.milestone_name || `Milestone ${item.milestone_id}`,
        description: item.description,
        is_completed: item.is_completed,
        reward_claimed: item.reward_claimed,
        reward_type: item.reward_type || 'discount_percentage',
        reward_value: item.reward_value || 0,
        current_points: item.current_points || 0,
        points_target: item.points_target || 100,
        claimed_at: item.claimed_at,
        milestone_type: item.milestone_type
      }));
      
      setMilestones(transformedMilestones);
      setCompletedMilestones(transformedMilestones.filter(m => m.is_completed));
      
      // Calculate total points
      const points = transformedMilestones.reduce((sum, milestone) => sum + milestone.current_points, 0);
      setTotalPoints(points);
      
    } catch (err) {
      logger.error('Error fetching milestones:', { error: err });
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        variant: 'destructive',
        title: 'Failed to load rewards',
        description: 'Could not retrieve your available rewards'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRewards();
  }, [userId]);

  // Claim a reward
  const claimReward = async (milestoneId: string) => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('user_milestones')
        .update({
          reward_claimed: true,
          claimed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('milestone_id', milestoneId);
      
      if (error) throw error;
      
      // Update the local state
      setAvailableRewards(prev => 
        prev.filter(reward => reward.milestone_id !== milestoneId)
      );
      
      // Refresh all milestone data
      refreshData();
      
      return true;
    } catch (error) {
      logger.error('Error claiming reward:', { error });
      toast({
        variant: 'destructive',
        title: 'Failed to claim reward',
        description: 'An error occurred while claiming your reward'
      });
      return false;
    }
  };

  return {
    availableRewards,
    milestones,
    completedMilestones,
    totalPoints,
    isLoading,
    error,
    claimReward,
    refreshData
  };
}
