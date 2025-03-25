
import {
  MilestoneServiceInterface,
  UpdateMilestoneProgressParams,
  MilestoneUpdateResult
} from "./milestone-service-types";
import { 
  UserMilestone, 
  MilestoneProgress, 
  AvailableReward,
  UserActivity
} from "@/types/api";
import { milestoneDataService } from "./milestone-data-service";
import { userActivityService } from "./user-activity-service";
import { rewardsService } from "./rewards-service";

/**
 * Milestone service for managing user milestone progress and rewards
 * 
 * This service acts as a facade for the various milestone-related services,
 * providing a unified interface for other parts of the application to work with.
 */
export class MilestoneService implements MilestoneServiceInterface {
  /**
   * Get all milestones for a specific user
   */
  async getUserMilestones(userId: string): Promise<UserMilestone[]> {
    return await milestoneDataService.getUserMilestones(userId);
  }
  
  /**
   * Get user progress towards milestones
   */
  async getUserMilestoneProgress(userId: string): Promise<MilestoneProgress[]> {
    return await milestoneDataService.getUserMilestoneProgress(userId);
  }
  
  /**
   * Get user activity history
   */
  async getUserActivities(userId: string): Promise<UserActivity[]> {
    return await userActivityService.getUserActivities(userId);
  }
  
  /**
   * Get available unclaimed rewards for a user
   */
  async getAvailableRewards(userId: string): Promise<AvailableReward[]> {
    return await rewardsService.getAvailableRewards(userId);
  }
  
  /**
   * Get milestone icons for a set of milestone IDs
   */
  async getMilestoneIcons(milestoneIds: string[]): Promise<{id: string, icon: string}[]> {
    return await milestoneDataService.getMilestoneIcons(milestoneIds);
  }
  
  /**
   * Update a user's progress towards milestones
   */
  async updateMilestoneProgress(params: UpdateMilestoneProgressParams): Promise<MilestoneUpdateResult> {
    return await userActivityService.updateMilestoneProgress(params);
  }
  
  /**
   * Claim a reward associated with a completed milestone
   */
  async claimReward(userId: string, milestoneId: string): Promise<boolean> {
    return await rewardsService.claimReward(userId, milestoneId);
  }
  
  /**
   * Calculate total points earned by a user
   */
  async calculateTotalPoints(userId: string): Promise<number> {
    return await milestoneDataService.calculateTotalPoints(userId);
  }
}

// Create a singleton instance
export const milestoneService = new MilestoneService();
