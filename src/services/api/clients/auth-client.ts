
import { supabaseClient } from "../supabase-client";
import { UserResponse } from "@/types/api";

/**
 * Authentication API Client
 */
export const authClient = {
  /**
   * Get the current user
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return { user: data.user };
  },
  
  /**
   * Sign out the current user
   */
  signOut: async () => {
    return await supabaseClient.auth.signOut();
  }
};
