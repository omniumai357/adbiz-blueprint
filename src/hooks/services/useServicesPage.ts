
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { showErrorToast } from '@/utils/toast-utils';
import { useTour } from '@/contexts/tour-context';
import { useAuthUser } from '@/hooks/queries/useAuthUser';
import { useUserOrders } from '@/hooks/queries/useUserOrders';

export function useServicesPage() {
  const [searchParams] = useSearchParams();
  const { isActive: isTourActive, startTour } = useTour();
  const { toast } = useToast();
  const [viewedPackages, setViewedPackages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("monthly");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: user, isLoading: isUserLoading, error: userError } = useAuthUser();
  const { data: orders, isLoading: isOrdersLoading, error: ordersError } = useUserOrders(user?.id);
  
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam && !viewedPackages.includes(packageParam)) {
      setViewedPackages(prev => [...prev, packageParam]);
    }
  }, [searchParams, viewedPackages]);
  
  useEffect(() => {
    if (orders) {
      setHasPurchased(orders.length > 0);
    }
  }, [orders]);
  
  useEffect(() => {
    if (userError) {
      const errorMessage = userError instanceof Error ? userError.message : 'Error checking user data';
      setError(errorMessage);
      showErrorToast("Error", userError);
      console.error("Error checking user data:", userError);
    }
    
    if (ordersError) {
      const errorMessage = ordersError instanceof Error ? ordersError.message : 'Error fetching order data';
      setError(errorMessage);
      showErrorToast("Error", ordersError);
      console.error("Error fetching order data:", ordersError);
    }
  }, [userError, ordersError, toast]);
  
  useEffect(() => {
    const tourCompleted = localStorage.getItem('tour_completed_services') === 'true';
    setHasCompletedTour(tourCompleted);
  }, []);
  
  useEffect(() => {
    if (!isTourActive) {
      localStorage.setItem('tour_completed_services', 'true');
      setHasCompletedTour(true);
    }
  }, [isTourActive]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#start-tour') {
        startTour("services");
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    };
    
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [startTour]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  return {
    viewedPackages,
    selectedCategory,
    hasCompletedTour,
    hasPurchased,
    error,
    isLoading: isUserLoading || isOrdersLoading,
    handleCategoryChange
  };
}
