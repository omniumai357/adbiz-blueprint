export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  avatar?: string;
  type?: string; // Add this property
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
