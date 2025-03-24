import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/ui/use-toast";

export const useAuthActions = () => {
  // Helper function for consistent error handling
  const handleAuthError = (error: any, action: string) => {
    console.error(`Auth error during ${action}:`, error);
    
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
    
    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    try {
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

      toast({
        title: "Account created",
        description: "Please check your email for the confirmation link.",
      });
      
      return { success: true, message: "Please check your email for the confirmation link." };
    } catch (error: any) {
      return handleAuthError(error, "signup");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      return { success: true };
    } catch (error: any) {
      return handleAuthError(error, "signin");
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      return { success: true };
    } catch (error: any) {
      return handleAuthError(error, "signout");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) {
        throw error;
      }
      
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

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
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
