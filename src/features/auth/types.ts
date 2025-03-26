
import { Session, User } from "@supabase/supabase-js";

/**
 * Auth Context Type Definition
 * 
 * Defines the shape of the authentication context shared throughout the application
 */
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
  isAdmin: boolean;
}

/**
 * Auth Result Type
 * 
 * Represents the result of an authentication operation
 */
export interface AuthResult {
  error: Error | null;
  user: User | null;
}
