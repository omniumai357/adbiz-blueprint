
import { supabase } from '@/integrations/supabase/client';
import type { User as AuthUser, Session, AuthResponse } from '@supabase/supabase-js';
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
   * @returns {Promise<{ error: Error | null }>} Promise resolving when sign out is complete
   */
  async signOut(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
};
