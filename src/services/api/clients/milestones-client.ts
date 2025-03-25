
import { milestoneService } from '@/services/milestone/milestone-service';
import { AvailableReward, PaymentProcessParams } from "@/types/api";
import { UpdateMilestoneProgressParams } from '@/services/milestone/milestone-service-types';

/**
 * Milestones API Client
 * This client delegates to the milestone service for all operations
 */
export const milestonesClient = {
  /**
   * Get user milestones
   */
  getUserMilestones: async (userId: string) => {
    return await milestoneService.getUserMilestones(userId);
  },
  
  /**
   * Get user activities
   */
  getUserActivities: async (userId: string) => {
    return await milestoneService.getUserActivities(userId);
  },
  
  /**
   * Get available rewards
   */
  getAvailableRewards: async (userId: string): Promise<AvailableReward[]> => {
    return await milestoneService.getAvailableRewards(userId);
  },
  
  /**
   * Get milestone icons
   */
  getMilestoneIcons: async (milestoneIds: string[]): Promise<{id: string, icon: string}[]> => {
    return await milestoneService.getMilestoneIcons(milestoneIds);
  },
  
  /**
   * Update milestone progress
   */
  updateMilestoneProgress: async (params: UpdateMilestoneProgressParams) => {
    return await milestoneService.updateMilestoneProgress(params);
  },
  
  /**
   * Claim a reward
   */
  claimReward: async (userId: string, milestoneId: string) => {
    return await milestoneService.claimReward(userId, milestoneId);
  },
  
  /**
   * Calculate total points
   */
  calculateTotalPoints: async (userId: string) => {
    return await milestoneService.calculateTotalPoints(userId);
  }
};
