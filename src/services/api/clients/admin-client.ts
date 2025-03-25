
import { supabaseClient } from "../supabase-client";

/**
 * Admin API Client
 */
export const adminClient = {
  /**
   * Check if a user has admin status
   */
  checkAdminStatus: async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabaseClient.rpc('is_admin', {
        user_id: userId
      });
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
};
