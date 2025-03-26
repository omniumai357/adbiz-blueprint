
import { createClient, User, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Extended Supabase Client
 * 
 * This client extends the base Supabase client with additional methods
 * organized by domain (auth, profiles, orders, etc.) to provide a more
 * structured and consistent API for accessing Supabase data.
 */
export interface ExtendedSupabaseClient {
  auth: {
    getUser: () => Promise<User | null>;
    signOut: () => Promise<{ error: Error | null }>;
    getCurrentUser: () => Promise<User | null>;
    getSession: () => Promise<{ session: any; error: Error | null }>;
  };
  profiles: {
    getProfileById: (userId: string) => Promise<any>;
    updateProfile: (userId: string, profileData: any) => Promise<any>;
    createProfile: (profileData: any) => Promise<any>;
  };
  orders: {
    getOrdersByUserId: (userId: string) => Promise<any[]>;
    getOrderById: (orderId: string) => Promise<any>;
    createOrder: (orderData: any) => Promise<any>;
    updateOrderStatus: (orderId: string, status: string) => Promise<any>;
  };
  packages: {
    getAllPackages: () => Promise<any[]>;
    getPackagesByCategory: (category: string) => Promise<any[]>;
    getPackageById: (packageId: string) => Promise<any>;
  };
  milestones: {
    getUserMilestones: (userId: string) => Promise<any[]>;
    getUserActivities: (userId: string) => Promise<any[]>;
    getAvailableRewards: (userId: string) => Promise<any[]>;
    getMilestoneIcons: (milestoneIds: string[]) => Promise<any[]>;
    updateMilestoneProgress: (params: {
      userId: string;
      points: number;
      activityType: string;
      referenceId?: string;
      referenceType?: string;
    }) => Promise<any>;
    claimReward: (userId: string, milestoneId: string) => Promise<any>;
    calculateTotalPoints: (userId: string) => Promise<number>;
  };
  admin: {
    checkAdminStatus: (userId: string) => Promise<boolean>;
  };
  rpc: SupabaseClient['rpc'];
  from: SupabaseClient['from'];
}

/**
 * Extended Supabase Client Implementation
 * 
 * This implementation provides a structured facade over the raw Supabase client,
 * organizing methods by domain area and providing consistent error handling.
 */
const extendedClient: ExtendedSupabaseClient = {
  auth: {
    getUser: async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        return data.user;
      } catch (error) {
        console.error("Error getting user:", error);
        return null;
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        return { error };
      } catch (error) {
        console.error("Error signing out:", error);
        return { error: error as Error };
      }
    },
    getCurrentUser: async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        return data.user;
      } catch (error) {
        console.error("Error getting current user:", error);
        return null;
      }
    },
    getSession: async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        return { session: data.session, error: null };
      } catch (error) {
        console.error("Error getting session:", error);
        return { session: null, error: error as Error };
      }
    }
  },
  profiles: {
    getProfileById: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error getting profile for user ${userId}:`, error);
        return null;
      }
    },
    updateProfile: async (userId: string, profileData: any) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', userId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error updating profile for user ${userId}:`, error);
        throw error;
      }
    },
    createProfile: async (profileData: any) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error creating profile:", error);
        throw error;
      }
    }
  },
  orders: {
    getOrdersByUserId: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error(`Error getting orders for user ${userId}:`, error);
        return [];
      }
    },
    getOrderById: async (orderId: string) => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error getting order ${orderId}:`, error);
        return null;
      }
    },
    createOrder: async (orderData: any) => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error creating order:", error);
        throw error;
      }
    },
    updateOrderStatus: async (orderId: string, status: string) => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error updating status for order ${orderId}:`, error);
        throw error;
      }
    }
  },
  packages: {
    getAllPackages: async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('active', true);
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error getting packages:", error);
        return [];
      }
    },
    getPackagesByCategory: async (category: string) => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('category', category)
          .eq('active', true);
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error(`Error getting packages for category ${category}:`, error);
        return [];
      }
    },
    getPackageById: async (packageId: string) => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('id', packageId)
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error getting package ${packageId}:`, error);
        return null;
      }
    }
  },
  milestones: {
    getUserMilestones: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_milestones')
          .select('*, milestone:milestone_id(*)')
          .eq('user_id', userId);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error(`Error getting milestones for user ${userId}:`, error);
        return [];
      }
    },
    getUserActivities: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error(`Error getting activities for user ${userId}:`, error);
        return [];
      }
    },
    getAvailableRewards: async (userId: string) => {
      try {
        const { data, error } = await supabase.rpc('get_user_available_rewards', {
          p_user_id: userId
        });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error(`Error getting available rewards for user ${userId}:`, error);
        return [];
      }
    },
    getMilestoneIcons: async (milestoneIds: string[]) => {
      try {
        const { data, error } = await supabase
          .from('milestones')
          .select('id, icon')
          .in('id', milestoneIds);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error getting milestone icons:", error);
        return [];
      }
    },
    updateMilestoneProgress: async (params) => {
      try {
        const { data, error } = await supabase.rpc('update_user_milestone_progress', {
          p_user_id: params.userId,
          p_points: params.points,
          p_activity_type: params.activityType,
          p_reference_id: params.referenceId,
          p_reference_type: params.referenceType
        });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error updating milestone progress:", error);
        throw error;
      }
    },
    claimReward: async (userId: string, milestoneId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_milestones')
          .update({ reward_claimed: true, claimed_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('milestone_id', milestoneId);
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error claiming reward for user ${userId}, milestone ${milestoneId}:`, error);
        throw error;
      }
    },
    calculateTotalPoints: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_activities')
          .select('points_earned')
          .eq('user_id', userId);
        
        if (error) throw error;
        
        // Sum up all the points
        const totalPoints = (data || []).reduce(
          (sum, activity) => sum + (activity.points_earned || 0), 
          0
        );
        
        return totalPoints;
      } catch (error) {
        console.error(`Error calculating total points for user ${userId}:`, error);
        return 0;
      }
    }
  },
  admin: {
    checkAdminStatus: async (userId: string) => {
      try {
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: userId
        });
        
        if (error) throw error;
        return !!data;
      } catch (error) {
        console.error(`Error checking admin status for user ${userId}:`, error);
        return false;
      }
    }
  },
  rpc: supabase.rpc.bind(supabase),
  from: supabase.from.bind(supabase)
};

export { extendedClient as supabaseClient };
