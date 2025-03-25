
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
    // Properly handle the response from getUser() - this returns { data, error } not a User object
    const response = await supabaseClient.auth.getUser();
    if (response.error) throw response.error;
    return { user: response.data.user };
  },
  
  /**
   * Sign out the current user
   * @returns {Promise<void>} Promise resolving when sign out is complete
   */
  signOut: async () => {
    return await supabaseClient.auth.signOut();
  }
};
