
/**
 * Auth utility functions
 */

/**
 * Check if a user has a specific role
 */
export const hasRole = (user: any, role: string): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user: any): string => {
  if (!user) return 'Guest';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }
  
  if (user.user_metadata?.name) {
    return user.user_metadata.name;
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'User';
};
