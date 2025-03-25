
import { supabaseClient } from "../supabase-client";
import { Profile } from "@/types/api";

/**
 * User profiles API Client
 */
export const profilesClient = {
  /**
   * Get a user profile by ID
   */
  getProfile: async (userId: string): Promise<Profile | null> => {
    if (!userId) throw new Error("User ID is required");
    
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Update a user profile
   */
  updateProfile: async (userId: string, profileData: Partial<Profile>) => {
    if (!userId) throw new Error("User ID is required");
    
    const { data, error } = await supabaseClient
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  }
};
