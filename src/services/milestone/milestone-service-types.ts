
import { 
  UserMilestone, 
  MilestoneProgress, 
  AvailableReward 
} from '@/types/api';

/**
 * Interface for milestone update parameters
 */
export interface UpdateMilestoneProgressParams {
  userId: string;
  points: number;
  activityType: string;
  referenceId?: string;
  referenceType?: string;
}

/**
 * Result of milestone progress update operation
 */
export interface MilestoneUpdateResult {
  success: boolean;
  error?: any;
}

/**
 * Interface for the milestone service
 */
export interface MilestoneServiceInterface {
  /**
   * Get all milestones for a specific user
   */
  getUserMilestones(userId: string): Promise<UserMilestone[]>;
  
  /**
   * Get user progress towards milestones
   */
  getUserMilestoneProgress(userId: string): Promise<MilestoneProgress[]>;
  
  /**
   * Get user activity history
   */
  getUserActivities(userId: string): Promise<any[]>;
  
  /**
   * Get available unclaimed rewards for a user
   */
  getAvailableRewards(userId: string): Promise<AvailableReward[]>;
  
  /**
   * Get milestone icons for a set of milestone IDs
   */
  getMilestoneIcons(milestoneIds: string[]): Promise<{id: string, icon: string}[]>;
  
  /**
   * Update a user's progress towards milestones
   */
  updateMilestoneProgress(params: UpdateMilestoneProgressParams): Promise<MilestoneUpdateResult>;
  
  /**
   * Claim a reward associated with a completed milestone
   */
  claimReward(userId: string, milestoneId: string): Promise<boolean>;
  
  /**
   * Calculate total points earned by a user
   */
  calculateTotalPoints(userId: string): Promise<number>;
}
