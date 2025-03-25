
import { supabaseClient } from "../supabase-client";
import { Profile } from "@/types/api";
import { apiResponseHandler } from "../response-handler";

/**
 * User profiles API Client
 * Handles CRUD operations for user profile data
 */
export const profilesClient = {
  /**
   * Get a user profile by ID
   * 
   * @param {string} userId - The ID of the user to fetch the profile for
   * @returns {Promise<Profile|null>} The user profile or null if not found
   * @throws Will throw an error if the userId is missing or if the query fails
   */
  getProfile: async (userId: string): Promise<Profile | null> => {
    if (!userId) throw new Error("User ID is required");
    
    return apiResponseHandler.handle(
      supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(),
      {
        context: 'Get User Profile',
        transform: (response) => response.data as Profile | null,
        showErrorToast: true
      }
    );
  },
  
  /**
   * Update a user profile
   * 
   * @param {string} userId - The ID of the user whose profile to update
   * @param {Partial<Profile>} profileData - The profile data to update
   * @returns {Promise<Profile>} The updated profile
   * @throws Will throw an error if the userId is missing or if the update fails
   */
  updateProfile: async (userId: string, profileData: Partial<Profile>): Promise<Profile> => {
    if (!userId) throw new Error("User ID is required");
    
    return apiResponseHandler.handle(
      supabaseClient
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .maybeSingle(),
      {
        context: 'Update User Profile',
        transform: (response) => response.data as Profile,
        showErrorToast: true,
        showSuccessToast: true,
        successMessage: "Profile updated successfully"
      }
    );
  }
};
