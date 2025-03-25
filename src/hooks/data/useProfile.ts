
import { useUserProfile } from "@/hooks/queries/useUserProfile";

export const useProfile = (userId: string | undefined) => {
  const { data, isLoading, error } = useUserProfile(userId);

  return { 
    profile: data, 
    isLoading, 
    error 
  };
};
