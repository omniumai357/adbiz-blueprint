
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type with custom properties
export interface User extends SupabaseUser {
  // Add custom properties that might be accessed in the application
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
    image?: string;
    [key: string]: any;
  };
}

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface AuthContextType {
  session: any | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
}
