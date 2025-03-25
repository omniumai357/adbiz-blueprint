
import { supabase } from '@/integrations/supabase/client';
import type { User as AuthUser } from '@supabase/supabase-js';
import { UserResponse } from '@/types/api';

/**
 * Client for handling authentication-related API requests
 */
export const authClient = {
  /**
   * Gets the current user data
   * @returns User data or null if not authenticated
   */
  async getCurrentUser(): Promise<UserResponse> {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.error("Failed to get current user:", error);
      return { user: null };
    }
    
    return { user: data.user };
  },
  
  /**
   * Sign out the current user
   * @returns {Promise<void>} Promise resolving when sign out is complete
   */
  signOut: async () => {
    return await supabase.auth.signOut();
  }
};
