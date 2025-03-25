
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTour } from '@/contexts/tour-context';
import { useToast } from '@/hooks/use-toast';

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
  
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam && !viewedPackages.includes(packageParam)) {
      setViewedPackages(prev => [...prev, packageParam]);
    }
  }, [searchParams, viewedPackages]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .limit(1);
            
          if (ordersError) {
            throw new Error(ordersError.message);
          }
            
          setHasPurchased(orders && orders.length > 0);
          
          const tourCompleted = localStorage.getItem('tour_completed_services') === 'true';
          setHasCompletedTour(tourCompleted);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error checking user data';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        console.error("Error checking user data:", err);
      }
    };
    
    fetchUserData();
  }, [toast]);
  
  useEffect(() => {
    if (!isTourActive) {
      localStorage.setItem('tour_completed_services', 'true');
      setHasCompletedTour(true);
    }
  }, [isTourActive]);

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
    handleCategoryChange,
    handleResourceAccess,
    closeDownloadModal
  };
}
