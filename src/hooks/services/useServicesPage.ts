
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTour } from '@/contexts/tour-context';

interface DownloadResource {
  id: string;
  type: string;
  title: string;
}

export function useServicesPage() {
  const [searchParams] = useSearchParams();
  const { isActive: isTourActive, startTour } = useTour();
  const [viewedPackages, setViewedPackages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("monthly");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadResource, setDownloadResource] = useState<DownloadResource | null>(null);
  
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam && !viewedPackages.includes(packageParam)) {
      setViewedPackages(prev => [...prev, packageParam]);
    }
  }, [searchParams, viewedPackages]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: orders } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .limit(1);
            
          setHasPurchased(orders && orders.length > 0);
          
          const tourCompleted = localStorage.getItem('tour_completed_services') === 'true';
          setHasCompletedTour(tourCompleted);
        }
      } catch (error) {
        console.error("Error checking user data:", error);
      }
    };
    
    fetchUserData();
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
  };
  
  const closeDownloadModal = () => {
    setShowDownloadModal(false);
  };
  
  return {
    viewedPackages,
    selectedCategory,
    hasCompletedTour,
    hasPurchased,
    showDownloadModal,
    downloadResource,
    handleCategoryChange,
    handleResourceAccess,
    closeDownloadModal
  };
}
