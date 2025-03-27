
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/ui/use-toast";
import { logger } from "@/utils/logger";
import { AuthResult } from "../types";

/**
 * Hook providing core authentication actions with standardized error handling and user feedback.
 */
export const useAuthActions = () => {
  // Helper function for consistent error handling
  const handleAuthError = (error: any, action: string): AuthResult => {
    logger.error(`Auth error during ${action}:`, {
      context: 'Auth',
      data: {
        action,
        errorMessage: error?.message,
        errorCode: error?.code
      }
    });
    
    const errorMessage = error?.message || `An error occurred during ${action}.`;
    
    // Custom error messages for common auth errors
    const friendlyMessage = 
      errorMessage.includes("Email not confirmed") ? "Please check your email and confirm your account before signing in." :
      errorMessage.includes("Invalid login credentials") ? "Invalid email or password. Please try again." :
      errorMessage.includes("User already registered") ? "An account with this email already exists." :
      errorMessage.includes("Password should be") ? "Password must be at least 6 characters long." :
      errorMessage;

    toast({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} failed`,
      description: friendlyMessage,
      variant: "destructive",
    });
    
    return { 
      success: false, 
      error: { 
        message: friendlyMessage,
        code: error?.code
      }
    };
  };

  /**
   * Register a new user
   */
  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }): Promise<AuthResult> => {
    try {
      logger.info("Attempting user signup", {
        context: 'Auth',
        data: { email }
      });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        throw error;
      }

      logger.info("User signup successful", {
        context: 'Auth',
        data: { email }
      });
      
      toast({
        title: "Account created",
        description: "Please check your email for the confirmation link.",
      });
      
      return { success: true, message: "Please check your email for the confirmation link." };
    } catch (error: any) {
      return handleAuthError(error, "signup");
    }
  };

  /**
   * Sign in an existing user
   */
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      logger.info("Attempting user signin", {
        context: 'Auth',
        data: { email }
      });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      logger.info("User signin successful", {
        context: 'Auth',
        data: { email }
      });
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      return { success: true };
    } catch (error: any) {
      return handleAuthError(error, "signin");
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async (): Promise<AuthResult> => {
    try {
      logger.info("Attempting user signout", {
        context: 'Auth'
      });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      logger.info("User signout successful", {
        context: 'Auth'
      });
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      return { success: true };
    } catch (error: any) {
      return handleAuthError(error, "signout");
    }
  };

  /**
   * Send a password reset email
   */
  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      logger.info("Attempting password reset", {
        context: 'Auth',
        data: { email }
      });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) {
        throw error;
      }
      
      logger.info("Password reset email sent", {
        context: 'Auth',
        data: { email }
      });
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
      });
      
      return { 
        success: true, 
        message: "Please check your email for the password reset link." 
      };
    } catch (error: any) {
      return handleAuthError(error, "password reset");
    }
  };

  /**
   * Update the current user's password
   */
  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    try {
      logger.info("Attempting password update", {
        context: 'Auth'
      });
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      logger.info("Password updated successfully", {
        context: 'Auth'
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      return { success: true };
    } catch (error: any) {
      return handleAuthError(error, "password update");
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
};
