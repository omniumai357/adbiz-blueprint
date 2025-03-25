import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { usePackages } from "@/hooks/queries/usePackages";

/**
 * Custom hook for managing the Services page state and business logic
 * 
 * Features:
 * - Gets the current authenticated user
 * - Fetches available service packages
 * - Handles any page-specific state management
 * 
 * @returns An object containing the current user, packages, and loading states
 * 
 * @example
 * const { user, packages, isLoading } = useServicesPage();
 */
export function useServicesPage() {
  const { user, isLoading: isUserLoading } = useAuth();
  const { data: packages, isLoading: isPackagesLoading } = usePackages();
  const [error, setError] = useState<string | null>(null);
  
  // Combined loading state
  const isLoading = isUserLoading || isPackagesLoading;
  
  return {
    user,
    packages: packages || [],
    isLoading,
    error
  };
}
