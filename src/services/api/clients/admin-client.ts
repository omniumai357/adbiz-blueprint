
import { supabaseClient } from "../supabase-client";

/**
 * Admin API Client
 * Provides functions for checking and managing admin privileges
 */
export const adminClient = {
  /**
   * Check if a user has admin status
   * 
   * @param {string} userId - The ID of the user to check
   * @returns {Promise<boolean>} Promise resolving to whether the user has admin status
   * @throws Will log but not propagate errors to prevent UI disruption
   */
  checkAdminStatus: async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Call the is_admin stored procedure in Supabase
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
