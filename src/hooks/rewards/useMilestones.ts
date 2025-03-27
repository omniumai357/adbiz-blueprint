
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/ui/use-toast';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch available rewards when userId changes
  useEffect(() => {
    const fetchRewards = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_milestones')
          .select('*')
          .eq('user_id', userId)
          .eq('is_completed', true)
          .eq('reward_claimed', false);
        
        if (error) throw error;
        
        setAvailableRewards(data as UserMilestone[]);
      } catch (error) {
        console.error('Error fetching milestones:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load rewards',
          description: 'Could not retrieve your available rewards'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRewards();
  }, [userId, toast]);

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
      
      return true;
    } catch (error) {
      console.error('Error claiming reward:', error);
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
    isLoading,
    claimReward
  };
}
