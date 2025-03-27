
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Extended User type that includes custom user properties
 */
export interface User extends SupabaseUser {
  // Add custom user properties
  name?: string;
  avatar_url?: string;
  type?: string;
}

/**
 * User profile data structure 
 */
export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Auth result type for consistent error handling
 */
export type AuthResult = 
  | { success: true; data?: any; message?: string }
  | { success: false; error: { code?: string; message: string } };

/**
 * Authentication context type definition
 */
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}
