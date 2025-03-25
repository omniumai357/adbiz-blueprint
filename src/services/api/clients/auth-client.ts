
import { supabase } from '@/integrations/supabase/client';
import type { User as AuthUser } from '@supabase/supabase-js';

/**
 * Client for handling authentication-related API requests
 */
export const authClient = {
  /**
   * Gets the current user data
   * @returns User data or null if not authenticated
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.error("Failed to get current user:", error);
      return null;
    }
    
    return data.user;
  },
  
  /**
   * Sign out the current user
   * @returns {Promise<void>} Promise resolving when sign out is complete
   */
  signOut: async () => {
    return await supabase.auth.signOut();
  }
};
