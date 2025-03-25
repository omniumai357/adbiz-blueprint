
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthResult {
  error: Error | null;
  user: User | null;
}

/**
 * Hook for auth-related data operations
 * Separates authentication data operations from UI components
 */
export function useAuthData() {
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Sign in with email and password
   */
  const signInWithEmail = async (
    email: string, 
    password: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error : new Error('Unknown error during sign in') 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Sign up with email and password
   */
  const signUpWithEmail = async (
    email: string, 
    password: string,
    metadata?: Record<string, any>
  ): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: metadata 
        }
      });
      
      if (error) throw error;
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error : new Error('Unknown error during sign up') 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Sign out the current user
   */
  const signOut = async (): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { 
        error: error instanceof Error ? error : new Error('Unknown error during sign out') 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get the current authenticated session
   */
  const getSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      return { session: data.session, error: null };
    } catch (error) {
      console.error('Error getting session:', error);
      return { 
        session: null, 
        error: error instanceof Error ? error : new Error('Unknown error getting session') 
      };
    }
  };
  
  return {
    signInWithEmail,
    signUpWithEmail,
    signOut,
    getSession,
    isLoading
  };
}
