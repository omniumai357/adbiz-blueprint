
import { createClient, User, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Supabase client with appropriate types
const supabaseClient = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Extended client with our custom methods
export interface ExtendedSupabaseClient extends SupabaseClient<Database> {
  auth: {
    getUser: () => Promise<{ user: User | null }>;
    signOut: () => Promise<{ error: Error | null }>;
    getCurrentUser: () => Promise<{ user: User | null }>;
  };
  profiles: {
    getProfileById: (userId: string) => Promise<any>;
  };
  orders: {
    getOrdersByUserId: (userId: string) => Promise<any[]>;
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
  };
}

// Extension implementation
const extendedClient: ExtendedSupabaseClient = {
  ...supabaseClient,
  auth: {
    ...supabaseClient.auth,
    getUser: async () => {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) throw error;
      return { user: data.user };
    },
    signOut: async () => {
      const { error } = await supabaseClient.auth.signOut();
      return { error };
    },
    getCurrentUser: async () => {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) throw error;
      return { user: data.user };
    }
  },
  profiles: {
    getProfileById: async (userId: string) => {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  orders: {
    getOrdersByUserId: async (userId: string) => {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  },
  milestones: {
    getUserMilestones: async (userId: string) => {
      const { data, error } = await supabaseClient
        .from('user_milestones')
        .select('*, milestone:milestone_id(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    },
    getUserActivities: async (userId: string) => {
      const { data, error } = await supabaseClient
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    getAvailableRewards: async (userId: string) => {
      const { data, error } = await supabaseClient.rpc('get_user_available_rewards', {
        p_user_id: userId
      });
      
      if (error) throw error;
      return data || [];
    },
    getMilestoneIcons: async (milestoneIds: string[]) => {
      const { data, error } = await supabaseClient
        .from('milestones')
        .select('id, icon')
        .in('id', milestoneIds);
      
      if (error) throw error;
      return data || [];
    },
    updateMilestoneProgress: async (params) => {
      const { data, error } = await supabaseClient.rpc('update_user_milestone_progress', {
        p_user_id: params.userId,
        p_points: params.points,
        p_activity_type: params.activityType,
        p_reference_id: params.referenceId,
        p_reference_type: params.referenceType
      });
      
      if (error) throw error;
      return data;
    },
    claimReward: async (userId: string, milestoneId: string) => {
      const { data, error } = await supabaseClient
        .from('user_milestones')
        .update({ reward_claimed: true, claimed_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('milestone_id', milestoneId);
      
      if (error) throw error;
      return data;
    }
  }
};

export { extendedClient as supabaseClient };
