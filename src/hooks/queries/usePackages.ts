
import { useQuery } from "@tanstack/react-query";
import { packagesClient } from "@/services/api/clients/packages-client";
import { Package } from "@/types/api";

/**
 * Custom hook for fetching available service packages
 * 
 * @returns Query object containing packages data, loading state, and error
 * 
 * @example
 * const { data: packages, isLoading, error } = usePackages();
 */
export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: async (): Promise<Package[]> => {
      try {
        return await packagesClient.getAllPackages();
      } catch (error) {
        console.error("Error fetching packages:", error);
        throw error;
      }
    }
  });
}
