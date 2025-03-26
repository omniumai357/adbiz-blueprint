
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
    return { error: error || null };
  },

  /**
   * Sign in with email and password
   * @param email User's email
   * @param password User's password
   * @returns Promise resolving to authentication response
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  /**
   * Sign up with email and password
   * @param email User's email
   * @param password User's password
   * @param metadata Additional user metadata
   * @returns Promise resolving to authentication response
   */
  async signUpWithEmail(
    email: string, 
    password: string, 
    metadata?: { first_name?: string; last_name?: string; [key: string]: any }
  ): Promise<AuthResponse> {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },

  /**
   * Reset password
   * @param email User's email
   * @returns Promise resolving to password reset response
   */
  async resetPassword(email: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error || null };
  },

  /**
   * Get the current session
   * @returns Promise resolving to current session or null
   */
  async getSession(): Promise<{ session: Session | null; error: Error | null }> {
    const { data, error } = await supabase.auth.getSession();
    return { 
      session: data?.session || null,
      error: error || null
    };
  },

  /**
   * Set up an auth state change listener
   * @param callback Function to call when auth state changes
   * @returns Subscription object that can be used to unsubscribe
   */
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
