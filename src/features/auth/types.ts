// Add or extend the User type to include the 'type' property
export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  type?: string;  // Add this property to fix the errors
  // Include other properties as needed
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
