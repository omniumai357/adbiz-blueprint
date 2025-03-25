
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
    const { user } = await supabaseClient.auth.getUser();
    return { user };
  },
  
  /**
   * Sign out the current user
   */
  signOut: async () => {
    return await supabaseClient.auth.signOut();
  }
};
