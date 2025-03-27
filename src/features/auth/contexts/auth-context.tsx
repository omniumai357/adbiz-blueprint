
import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/data/useProfile";
import { useAdminStatus } from "@/hooks/data/useAdminStatus";
import { useAuthActions } from "../hooks/use-auth-actions";
import { AuthContextType, User, UserProfile } from "../types";
import { logger } from "@/utils/logger";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Use the custom hooks
  const { profile } = useProfile(user?.id);
  const { isAdmin } = useAdminStatus(user?.id);
  const { signUp, signIn, signOut, resetPassword, updatePassword } = useAuthActions();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        logger.debug(`Auth state changed: ${event}`);
        setSession(currentSession);
        // Type assertion to cast the user to our extended User type
        setUser(currentSession?.user as User | null ?? null);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        logger.debug('Initializing auth session');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        // Type assertion to cast the user to our extended User type
        setUser(currentSession?.user as User | null ?? null);
      } catch (error) {
        logger.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Computed property for easier auth status checks
  const isAuthenticated = !!user;

  // Fixed return type to Promise<void>
  const logout = async (): Promise<void> => {
    try {
      const result = await signOut();
      // Type guard to check if result has error property
      if ('error' in result && result.error) {
        logger.error('Error signing out:', result.error);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      logger.error('Error during logout:', error);
    }
    // No return value for void Promise
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isAuthenticated,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        isAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
