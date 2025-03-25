import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
}

interface UserData {
  id: string | undefined;
  email: string | undefined;
}

interface ServicesPageState {
  packages: ServicePackage[] | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}

const useServicesPage = () => {
  const [state, setState] = useState<ServicesPageState>({
    packages: null,
    userData: null,
    loading: true,
    error: null,
  });

  const fetchServicePackages = async () => {
    try {
      const userData = await apiClient.auth.getCurrentUser();
      const packageData = await apiClient.packages.getAllPackages();
      
      // Process the user ID correctly
      const userId = userData.user?.id;
      
      setState({
        packages: packageData,
        userData: {
          id: userId,
          email: userData.user?.email,
        },
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        packages: null,
        userData: null,
        loading: false,
        error: error.message || 'Failed to fetch service packages.',
      });
    }
  };

  useEffect(() => {
    fetchServicePackages();
  }, []);

  return state;
};

export default useServicesPage;
