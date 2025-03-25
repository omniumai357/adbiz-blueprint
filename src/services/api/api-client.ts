
import { supabaseClient } from "./supabase-client";
import { CustomerInfo } from "@/types/checkout";

/**
 * API Client
 * 
 * A centralized service for making API calls to different resources.
 * This creates a separation between the data fetching logic and the UI components.
 */
export const apiClient = {
  /**
   * Authentication
   */
  auth: {
    /**
     * Get the current user
     */
    getCurrentUser: async () => {
      return await supabaseClient.auth.getUser();
    },
    
    /**
     * Sign out the current user
     */
    signOut: async () => {
      return await supabaseClient.auth.signOut();
    }
  },
  
  /**
   * User profile
   */
  profiles: {
    /**
     * Get a user profile by ID
     */
    getProfile: async (userId: string) => {
      if (!userId) throw new Error("User ID is required");
      return await supabaseClient.profiles.getProfileById(userId);
    },
    
    /**
     * Update a user profile
     */
    updateProfile: async (userId: string, profileData: Partial<any>) => {
      if (!userId) throw new Error("User ID is required");
      
      const { data, error } = await supabaseClient
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data;
    }
  },
  
  /**
   * Orders
   */
  orders: {
    /**
     * Get orders for a user
     */
    getUserOrders: async (userId: string) => {
      if (!userId) return [];
      return await supabaseClient.orders.getOrdersByUserId(userId);
    },
    
    /**
     * Create a new order
     */
    createOrder: async (orderData: {
      userId: string;
      packageId?: string;
      totalAmount: number;
      contactInfo: CustomerInfo;
      companyInfo?: any;
      paymentMethod: string;
      paymentId?: string;
    }) => {
      const { data, error } = await supabaseClient
        .from('orders')
        .insert({
          user_id: orderData.userId,
          package_id: orderData.packageId,
          total_amount: orderData.totalAmount,
          contact_info: orderData.contactInfo,
          company_info: orderData.companyInfo,
          payment_method: orderData.paymentMethod,
          payment_id: orderData.paymentId,
          status: 'completed'
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    }
  },
  
  /**
   * Packages
   */
  packages: {
    /**
     * Get all packages
     */
    getAllPackages: async () => {
      const { data, error } = await supabaseClient
        .from('packages')
        .select('*')
        .eq('active', true);
        
      if (error) throw error;
      return data;
    },
    
    /**
     * Get packages by category
     */
    getPackagesByCategory: async (category: string) => {
      const { data, error } = await supabaseClient
        .from('packages')
        .select('*')
        .eq('category', category)
        .eq('active', true);
        
      if (error) throw error;
      return data;
    },
    
    /**
     * Get package by ID
     */
    getPackageById: async (id: string) => {
      const { data, error } = await supabaseClient
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    }
  },
  
  /**
   * Milestones and rewards
   */
  milestones: {
    /**
     * Get user milestones
     */
    getUserMilestones: async (userId: string) => {
      if (!userId) return [];
      return await supabaseClient.milestones.getUserMilestones(userId);
    },
    
    /**
     * Get user activities
     */
    getUserActivities: async (userId: string) => {
      if (!userId) return [];
      return await supabaseClient.milestones.getUserActivities(userId);
    },
    
    /**
     * Get available rewards
     */
    getAvailableRewards: async (userId: string) => {
      if (!userId) return [];
      return await supabaseClient.milestones.getAvailableRewards(userId);
    },
    
    /**
     * Get milestone icons
     */
    getMilestoneIcons: async (milestoneIds: string[]) => {
      if (!milestoneIds.length) return [];
      return await supabaseClient.milestones.getMilestoneIcons(milestoneIds);
    },
    
    /**
     * Update milestone progress
     */
    updateMilestoneProgress: async (params: {
      userId: string;
      points: number;
      activityType: string;
      referenceId?: string;
      referenceType?: string;
    }) => {
      return await supabaseClient.milestones.updateMilestoneProgress(params);
    },
    
    /**
     * Claim a reward
     */
    claimReward: async (userId: string, milestoneId: string) => {
      return await supabaseClient.milestones.claimReward(userId, milestoneId);
    }
  }
};
