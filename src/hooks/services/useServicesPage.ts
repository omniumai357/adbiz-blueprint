
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
  const { data: packages, isLoading: isPackagesLoading, error: packagesError } = usePackages();
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("monthly");
  const [viewedPackages, setViewedPackages] = useState<string[]>([]);
  const [hasCompletedTour, setHasCompletedTour] = useState<boolean>(false);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  
  // Update error state if packages query fails
  useEffect(() => {
    if (packagesError) {
      setError(packagesError instanceof Error ? packagesError.message : "Error loading packages");
    }
  }, [packagesError]);
  
  // Combined loading state
  const isLoading = isUserLoading || isPackagesLoading;
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Track that user has viewed this category
    if (!viewedPackages.includes(category)) {
      setViewedPackages(prev => [...prev, category]);
    }
  };
  
  return {
    user,
    packages: packages || [],
    isLoading,
    error,
    selectedCategory,
    viewedPackages,
    hasCompletedTour,
    hasPurchased,
    handleCategoryChange
  };
}
