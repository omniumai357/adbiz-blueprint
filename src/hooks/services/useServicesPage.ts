
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTour } from '@/contexts/tour-context';
import { useAuthUser } from '@/hooks/queries/useAuthUser';
import { useUserOrders } from '@/hooks/queries/useUserOrders';

interface DownloadResource {
  id: string;
  type: string;
  title: string;
}

export function useServicesPage() {
  const [searchParams] = useSearchParams();
  const { isActive: isTourActive, startTour } = useTour();
  const { toast } = useToast();
  const [viewedPackages, setViewedPackages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("monthly");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadResource, setDownloadResource] = useState<DownloadResource | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Query user data with React Query
  const { data: user, isLoading: isUserLoading, error: userError } = useAuthUser();
  
  // Query user orders with React Query
  const { data: orders, isLoading: isOrdersLoading, error: ordersError } = useUserOrders(user?.id);
  
  // Update viewed packages when URL changes
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam && !viewedPackages.includes(packageParam)) {
      setViewedPackages(prev => [...prev, packageParam]);
    }
  }, [searchParams, viewedPackages]);
  
  // Update hasPurchased state when orders data loads
  useEffect(() => {
    if (orders) {
      setHasPurchased(orders.length > 0);
    }
  }, [orders]);
  
  // Handle errors from React Query
  useEffect(() => {
    if (userError) {
      const errorMessage = userError instanceof Error ? userError.message : 'Error checking user data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Error checking user data:", userError);
    }
    
    if (ordersError) {
      const errorMessage = ordersError instanceof Error ? ordersError.message : 'Error fetching order data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Error fetching order data:", ordersError);
    }
  }, [userError, ordersError, toast]);
  
  // Check if tour has been completed
  useEffect(() => {
    const tourCompleted = localStorage.getItem('tour_completed_services') === 'true';
    setHasCompletedTour(tourCompleted);
  }, []);
  
  // Save tour completion status
  useEffect(() => {
    if (!isTourActive) {
      localStorage.setItem('tour_completed_services', 'true');
      setHasCompletedTour(true);
    }
  }, [isTourActive]);

  // Handle hash change for starting tour
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#start-tour') {
        startTour();
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
  
  const handleResourceAccess = (resourceId: string, resourceType: string) => {
    try {
      let resourceTitle = "";
      
      if (resourceId === "premium-strategy-guide") {
        resourceTitle = "Premium Marketing Strategy Guide";
      } else if (resourceId === "budget-marketing-guide") {
        resourceTitle = "Effective Marketing on a Budget";
      } else if (resourceId === "getting-started-guide") {
        resourceTitle = "Getting Started with Your Package";
      }
      
      setDownloadResource({
        id: resourceId,
        type: resourceType,
        title: resourceTitle
      });
      
      setShowDownloadModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error accessing resource';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Error accessing resource:", err);
    }
  };
  
  const closeDownloadModal = () => {
    setShowDownloadModal(false);
    setDownloadResource(null);
  };
  
  return {
    viewedPackages,
    selectedCategory,
    hasCompletedTour,
    hasPurchased,
    showDownloadModal,
    downloadResource,
    error,
    isLoading: isUserLoading || isOrdersLoading,
    handleCategoryChange,
    handleResourceAccess,
    closeDownloadModal
  };
}
