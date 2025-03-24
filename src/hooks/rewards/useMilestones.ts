
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/ui/use-toast";

export interface Milestone {
  id: string;
  name: string;
  description: string;
  points_required: number;
  reward_type: 'discount_percentage' | 'discount_amount';
  reward_value: number;
  icon: string | null;
  is_active: boolean;
}

export interface UserMilestone {
  milestone_id: string;
  milestone_name: string;
  milestone_description: string;
  reward_type: 'discount_percentage' | 'discount_amount';
  reward_value: number;
  completed_at: string;
  is_claimed: boolean;
  icon?: string;
}

export interface MilestoneProgress {
  milestone_id: string;
  milestone_name: string;
  points_required: number;
  current_points: number;
  progress_percentage: number;
  icon: string | null;
}

export function useMilestones(userId: string | null | undefined) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [availableRewards, setAvailableRewards] = useState<UserMilestone[]>([]);
  const [progress, setProgress] = useState<MilestoneProgress[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all active milestones
  const fetchMilestones = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      setMilestones(data as Milestone[]);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  // Fetch user milestone progress
  const fetchUserProgress = async () => {
    if (!userId) return;
    
    try {
      // Get user milestone progress
      const { data: userMilestones, error: progressError } = await supabase
        .from('user_milestones')
        .select(`
          milestone_id,
          current_points,
          milestones (
            name,
            points_required,
            icon
          )
        `)
        .eq('user_id', userId);
      
      if (progressError) throw progressError;
      
      // Calculate total points from all activities
      const { data: activities, error: activitiesError } = await supabase
        .from('user_activities')
        .select('points_earned')
        .eq('user_id', userId);
      
      if (activitiesError) throw activitiesError;
      
      const total = activities?.reduce((sum, activity) => sum + (activity.points_earned || 0), 0) || 0;
      setTotalPoints(total);
      
      // Format progress data
      const progressData = userMilestones?.map(um => ({
        milestone_id: um.milestone_id,
        milestone_name: um.milestones?.name || '',
        points_required: um.milestones?.points_required || 0,
        current_points: um.current_points,
        progress_percentage: Math.min(100, Math.round((um.current_points / (um.milestones?.points_required || 1)) * 100)),
        icon: um.milestones?.icon
      })) || [];
      
      setProgress(progressData);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  // Fetch available unclaimed rewards
  const fetchAvailableRewards = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .rpc('get_user_available_rewards', { p_user_id: userId });
      
      if (error) throw error;
      
      // Fetch milestone icons and add them to the rewards
      const milestonesWithIcons = await supabase
        .from('milestones')
        .select('id, icon')
        .in('id', data.map((r: UserMilestone) => r.milestone_id));
      
      const iconMap = (milestonesWithIcons.data || []).reduce((map: Record<string, string>, m) => {
        map[m.id] = m.icon;
        return map;
      }, {});
      
      const rewardsWithIcons = data.map((reward: UserMilestone) => ({
        ...reward,
        icon: iconMap[reward.milestone_id]
      }));
      
      setAvailableRewards(rewardsWithIcons);
    } catch (error) {
      console.error('Error fetching available rewards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Claim a reward
  const claimReward = async (milestoneId: string) => {
    if (!userId) return;
    
    try {
      // Update the user_milestone record to mark the reward as claimed
      const { error } = await supabase
        .from('user_milestones')
        .update({
          reward_claimed: true,
          claimed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('milestone_id', milestoneId);
      
      if (error) throw error;
      
      // Remove the claimed reward from the available rewards list
      setAvailableRewards(prev => prev.filter(r => r.milestone_id !== milestoneId));
      
      // Find the reward to show details in the toast
      const reward = availableRewards.find(r => r.milestone_id === milestoneId);
      
      toast({
        title: "Reward Claimed!",
        description: `You've claimed a ${reward?.reward_value}${reward?.reward_type === 'discount_percentage' ? '%' : '$'} discount. It will be applied to your next purchase.`,
      });
      
      return reward;
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to claim reward. Please try again.",
      });
      return null;
    }
  };

  // Load all data when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      Promise.all([
        fetchMilestones(),
        fetchUserProgress(),
        fetchAvailableRewards()
      ]).finally(() => setIsLoading(false));
    } else {
      setMilestones([]);
      setProgress([]);
      setAvailableRewards([]);
      setTotalPoints(0);
      setIsLoading(false);
    }
  }, [userId]);

  return {
    milestones,
    progress,
    availableRewards,
    totalPoints,
    isLoading,
    claimReward,
    refreshData: () => {
      fetchUserProgress();
      fetchAvailableRewards();
    }
  };
}
