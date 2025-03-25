import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/api';

/**
 * Client for handling authentication-related API requests
 */
export const authClient = {
  /**
   * Gets the current user data
   * @returns User data or null if not authenticated
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error("Failed to get current user:", error);
      return null;
    }
    
    return {
      id: user.id,
      email: user.email || '',
      username: user.user_metadata?.username || '',
      firstName: user.user_metadata?.firstName || '',
      lastName: user.user_metadata?.lastName || '',
      role: user.user_metadata?.role || 'customer',
      avatarUrl: user.user_metadata?.avatarUrl || null
    };
  },
  
  /**
   * Sign out the current user
   * @returns {Promise<void>} Promise resolving when sign out is complete
   */
  signOut: async () => {
    return await supabase.auth.signOut();
  }
};
