
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define the type for user milestones
export interface UserMilestone {
  id: string;
  user_id: string;
  milestone_id: string;
  milestone_name: string;
  milestone_description?: string;
  description?: string; // Alias for compatibility
  milestone_type?: string;
  current_points: number;
  points_target: number;
  is_completed: boolean;
  reward_type: string;
  reward_value: number;
  reward_claimed: boolean;
  completed_at: string;
  claimed_at: string;
  created_at: string;
  updated_at: string;
  icon?: string; // For UI purposes
  milestone?: string; // Alias for milestone_id for compatibility
}

// Define the raw data type from the database
interface RawUserMilestone {
  id: string;
  user_id: string;
  milestone_id: string;
  current_points: number;
  is_completed: boolean;
  reward_claimed: boolean;
  completed_at: string;
  claimed_at: string;
  created_at: string;
  updated_at: string;
}

export function useMilestones(userId?: string) {
  const [availableRewards, setAvailableRewards] = useState<UserMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Add these for compatibility with MilestonesDashboard
  const [milestones, setMilestones] = useState<UserMilestone[]>([]);
  const [completedMilestones, setCompletedMilestones] = useState<UserMilestone[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // Fetch user milestones from Supabase
  const fetchMilestones = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch user milestones
      const { data: userMilestones, error: userMilestoneError } = await supabase
        .from('user_milestones')
        .select('*')
        .eq('user_id', userId);
      
      if (userMilestoneError) throw userMilestoneError;
      
      // Add milestone details to the user milestones
      const enhancedMilestones: UserMilestone[] = (userMilestones || []).map((rawMilestone: RawUserMilestone) => {
        // For now, we'll enhance with mock data since we don't have the actual milestone table
        // In a real app, you would join with the milestones table
        return {
          ...rawMilestone,
          milestone_name: `Milestone ${rawMilestone.milestone_id}`,
          description: `Description for milestone ${rawMilestone.milestone_id}`,
          milestone_description: `Description for milestone ${rawMilestone.milestone_id}`,
          reward_type: 'discount',
          reward_value: 10.00,
          points_target: 100,
          milestone_type: 'purchase',
          icon: 'trophy',
          milestone: rawMilestone.milestone_id // Alias for compatibility
        };
      });
      
      // Update all state variables
      setAvailableRewards(enhancedMilestones);
      setMilestones(enhancedMilestones);
      setCompletedMilestones(enhancedMilestones.filter(m => m.is_completed));
      setTotalPoints(enhancedMilestones.reduce((sum, m) => sum + m.current_points, 0));
    } catch (err) {
      console.error('Error fetching milestones:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch milestones'));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Claim a reward for a completed milestone
  const claimReward = useCallback(async (milestoneId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Update the milestone as claimed
      const { error: updateError } = await supabase
        .from('user_milestones')
        .update({ 
          reward_claimed: true,
          claimed_at: new Date().toISOString()
        })
        .eq('milestone_id', milestoneId)
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // Refresh the milestone data
      await fetchMilestones();
      
      return true;
    } catch (err) {
      console.error('Error claiming reward:', err);
      return false;
    }
  }, [userId, fetchMilestones]);

  // Load milestones on component mount or when userId changes
  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  return {
    availableRewards,
    isLoading,
    claimReward,
    error,
    refreshData: fetchMilestones,
    // Add these for compatibility
    milestones,
    completedMilestones,
    totalPoints
  };
}
