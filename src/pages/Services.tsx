
import React from 'react';
import { useServicesPage } from '@/hooks/services/useServicesPage';
import { useToast } from '@/hooks/ui/use-toast';
import { ServicesTitle } from '@/components/services/ServicesTitle';
import { useResourceAccess } from '@/hooks/useResourceAccess';
import { ResponsiveServicesPage } from '@/components/services/ResponsiveServicesPage';
import DownloadOptions from '@/components/DownloadOptions';

/**
 * Services Page Component
 * 
 * Displays available service packages and related information.
 * Manages the state and presentation of service offerings, including
 * package categories, features, recommendations, and resource downloads.
 */
const Services = () => {
  const {
    viewedPackages,
    selectedCategory,
    hasCompletedTour,
    hasPurchased,
    error,
    isLoading,
    handleCategoryChange
  } = useServicesPage();
  
  const { 
    showDownloadModal, 
    selectedResource, 
    handleResourceAccess, 
    closeDownloadModal 
  } = useResourceAccess();
  
  const { toast } = useToast();
  
  /**
   * Set up toast event listener to show notifications
   * based on application events
   */
  React.useEffect(() => {
    const handleShowToast = (event: Event) => {
      try {
        const customEvent = event as CustomEvent;
        if (customEvent.detail) {
          toast({
            title: customEvent.detail.title,
            description: customEvent.detail.description
          });
        }
      } catch (err) {
        console.error("Error handling toast event:", err);
        toast({
          title: "Error",
          description: "An error occurred displaying notification",
          variant: "destructive"
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
      <ServicesTitle />
      
      <ResponsiveServicesPage />
      
      {showDownloadModal && selectedResource && (
        <DownloadOptions
          purchaseId="resource-download"
          packageName={selectedResource.title}
          resourceType={selectedResource.type as "ebook" | "tutorial"}
          resourceTitle={selectedResource.title}
          onClose={closeDownloadModal}
        />
      )}
    </>
  );
};

export default Services;
