
import { useState, useEffect } from 'react';
import { apiClient } from "@/services/api/api-client";

interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  category: string;
}

interface UserData {
  id: string | undefined;
  email: string | undefined;
}

interface ServicesPageState {
  packages: ServicePackage[] | null;
  userData: UserData | null;
  viewedPackages: string[];
  selectedCategory: string;
  hasCompletedTour: boolean;
  hasPurchased: boolean;
  loading: boolean;
  error: string | null;
  isLoading: boolean;
  handleCategoryChange: (category: string) => void;
}

const useServicesPage = (): ServicesPageState => {
  const [packages, setPackages] = useState<ServicePackage[] | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [viewedPackages, setViewedPackages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("monthly");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // These would typically come from user data or context
  const hasCompletedTour = true;
  const hasPurchased = false;

  const fetchServicePackages = async () => {
    try {
      setLoading(true);
      const userData = await apiClient.auth.getCurrentUser();
      const packageData = await apiClient.packages.getAllPackages();
      
      // Process the user ID correctly
      const userId = userData.user?.id;
      
      setPackages(packageData);
      setUserData({
        id: userId,
        email: userData.user?.email,
      });
      
      // Track which packages the user has viewed
      const viewedIds = packageData ? packageData.slice(0, 2).map(pkg => pkg.id) : [];
      setViewedPackages(viewedIds);
      
      setLoading(false);
      setError(null);
    } catch (error: any) {
      setPackages(null);
      setUserData(null);
      setLoading(false);
      setError(error.message || 'Failed to fetch service packages.');
    }
  };

  useEffect(() => {
    fetchServicePackages();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // In a real app, you might want to fetch packages for this category
    // fetchPackagesByCategory(category);
  };

  return {
    packages,
    userData,
    viewedPackages,
    selectedCategory,
    hasCompletedTour,
    hasPurchased,
    loading,
    error,
    isLoading: loading, // Alias for loading for component compatibility
    handleCategoryChange,
  };
};

export default useServicesPage;
