
import { useAdminStatus as useAdminStatusQuery } from "@/hooks/queries/useAdminStatus";

export const useAdminStatus = (userId: string | undefined) => {
  const { data, isLoading, error } = useAdminStatusQuery(userId);

  return { 
    isAdmin: data, 
    isLoading, 
    error 
  };
};
