
import { supabase } from "@/integrations/supabase/client";

/**
 * Centralized service for handling Supabase API calls
 */
export const supabaseClient = {
  /**
   * Auth service calls
   */
  auth: {
    getUser: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
  },

  /**
   * Orders service calls
   */
  orders: {
    getOrdersByUserId: async (userId: string) => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed');
      
      if (error) throw error;
      return data;
    },
  },

  /**
   * User milestones service calls
   */
  milestones: {
    getUserMilestones: async (userId: string) => {
      const { data, error } = await supabase
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
      
      if (error) throw error;
      return data;
    },

    getUserActivities: async (userId: string) => {
      const { data, error } = await supabase
        .from('user_activities')
        .select('points_earned')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data;
    },

    getAvailableRewards: async (userId: string) => {
      const { data, error } = await supabase
        .rpc('get_user_available_rewards', { p_user_id: userId });
      
      if (error) throw error;
      
      return data;
    },

    getMilestoneIcons: async (milestoneIds: string[]) => {
      if (!milestoneIds.length) return [];
      
      const { data, error } = await supabase
        .from('milestones')
        .select('id, icon')
        .in('id', milestoneIds);
      
      if (error) throw error;
      return data;
    },

    updateMilestoneProgress: async (params: {
      userId: string;
      points: number;
      activityType: string;
      referenceId?: string;
      referenceType?: string;
    }) => {
      const { error } = await supabase.rpc('update_user_milestone_progress', {
        p_user_id: params.userId,
        p_points: params.points,
        p_activity_type: params.activityType,
        p_reference_id: params.referenceId,
        p_reference_type: params.referenceType
      });

      if (error) throw error;
      return { success: true };
    },

    claimReward: async (userId: string, milestoneId: string) => {
      const { error } = await supabase
        .from('user_milestones')
        .update({
          reward_claimed: true,
          claimed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('milestone_id', milestoneId);
      
      if (error) throw error;
      return { success: true };
    }
  },

  /**
   * User profile service calls
   */
  profiles: {
    getProfileById: async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
  },

  /**
   * Admin service calls
   */
  admin: {
    checkAdminStatus: async (userId: string) => {
      const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
      
      if (error) throw error;
      return !!data;
    }
  }
};
