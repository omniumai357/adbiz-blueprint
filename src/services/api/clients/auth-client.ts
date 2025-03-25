
import { supabaseClient } from "../supabase-client";
import { UserResponse } from "@/types/api";

/**
 * Authentication API Client
 * Handles user authentication operations like retrieving user data and signing out
 */
export const authClient = {
  /**
   * Get the current user
   * @returns {Promise<UserResponse>} Promise resolving to the current user data
   * @throws Will throw an error if the user retrieval fails
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    // Get the current user session from Supabase
    const { data, error } = await supabaseClient.auth.getUser();
    
    // If there was an error, throw it
    if (error) throw error;
    
    // Return the user data wrapped in the expected UserResponse format
    return { user: data.user };
  },
  
  /**
   * Sign out the current user
   * @returns {Promise<void>} Promise resolving when sign out is complete
   */
  signOut: async () => {
    return await supabaseClient.auth.signOut();
  }
};
