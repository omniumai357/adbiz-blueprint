
import { useState } from 'react';
import { useToast } from "@/hooks/ui/use-toast";
import { milestoneService } from "@/services/milestone/milestone-service";
import { AvailableReward } from '@/types/api';

/**
 * Hook for managing reward actions
 * 
 * This hook is responsible for:
 * - Claiming rewards
 * - Showing success/error notifications
 * 
 * @param userId - The ID of the user claiming rewards
 * @param refreshData - Function to refresh data after claiming a reward
 * @returns Object containing functions to interact with rewards
 */
export function useRewardActions(
  userId: string | null | undefined,
  refreshData: () => void
) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  /**
   * Claims a reward for the user
   * 
   * @param milestoneId - The ID of the milestone whose reward to claim
   * @returns The claimed reward, or null if claiming failed
   */
  const claimReward = async (milestoneId: string) => {
    if (!userId) return null;
    setIsProcessing(true);
    
    try {
      const success = await milestoneService.claimReward(userId, milestoneId);
      
      if (!success) throw new Error("Failed to claim reward");
      
      // Refresh data to update UI
      refreshData();
      
      toast({
        title: "Reward Claimed!",
        description: "You've claimed a discount. It will be applied to your next purchase.",
      });
      
      return true;
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to claim reward. Please try again.",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    claimReward,
    isProcessing
  };
}
