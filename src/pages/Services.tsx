
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ServicePackages } from '@/components/ServicePackages';
import { NextStepsSection, getServicePageRecommendations } from '@/components/recommendation/NextStepsSection';
import { useTour } from '@/contexts/tour-context';
import { supabase } from '@/integrations/supabase/client';
import DownloadOptions from '@/components/DownloadOptions';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const [searchParams] = useSearchParams();
  const { isActive: isTourActive, startTour } = useTour();
  const { toast } = useToast();
  const [viewedPackages, setViewedPackages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("monthly");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadResource, setDownloadResource] = useState<{id: string, type: string, title: string} | null>(null);
  
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam && !viewedPackages.includes(packageParam)) {
      setViewedPackages(prev => [...prev, packageParam]);
    }
  }, [searchParams]);
  
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
  
  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        toast({
          title: customEvent.detail.title,
          description: customEvent.detail.description
        });
      }
    };
    
    window.addEventListener('show-toast', handleShowToast);
    
    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, [toast]);

  return (
    <>
      <div id="services-title" className="mb-6">
        <h1 className="text-3xl font-bold">Our Services</h1>
        <p className="text-gray-600">Explore our range of advertising packages designed to boost your business visibility.</p>
      </div>
      
      <div id="category-selection" className="mb-8">
        {/* Category selection content */}
      </div>
      
      <div id="packages-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ServicePackages onCategoryChange={handleCategoryChange} />
      </div>
      
      <div id="package-features" className="mb-8">
        {/* Package features content */}
      </div>
      
      <div id="contact-cta" className="bg-gray-100 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-2">Need Assistance?</h3>
        <p className="mb-4">Our team is ready to help you choose the right package for your business needs.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Contact Us
        </button>
      </div>
      
      <NextStepsSection 
        recommendations={getServicePageRecommendations(
          viewedPackages,
          hasCompletedTour,
          selectedCategory,
          hasPurchased
        )}
        className="mt-12 mb-8"
        title="Recommended Next Steps"
        onResourceDownload={handleResourceAccess}
      />
      
      {showDownloadModal && downloadResource && (
        <DownloadOptions
          purchaseId="resource-download"
          packageName={downloadResource.title}
          resourceType={downloadResource.type as "ebook" | "tutorial"}
          resourceTitle={downloadResource.title}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </>
  );
};

export default Services;
