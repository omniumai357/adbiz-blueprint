
import React from 'react';
import { useServicesPage } from '@/hooks/services/useServicesPage';
import { useToast } from '@/hooks/ui/use-toast';
import { ServicesTitle } from '@/components/services/ServicesTitle';
import { useResourceAccess } from '@/hooks/useResourceAccess';
import { ServicesContent } from '@/components/services/ServicesContent';
import { createToastEvent } from '@/utils/toast-utils';

/**
 * Services Page Component
 * 
 * Displays available service packages and related information.
 * 
 * Features:
 * - Package category selection (monthly, quarterly, annual)
 * - Dynamic display of packages based on selected category
 * - Package features listing
 * - Next steps recommendations
 * - Resource download options
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
  
  // Set up toast event listener
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
      
      <ServicesContent
        viewedPackages={viewedPackages}
        selectedCategory={selectedCategory}
        hasCompletedTour={hasCompletedTour}
        hasPurchased={hasPurchased}
        error={error}
        isLoading={isLoading}
        showDownloadModal={showDownloadModal}
        selectedResource={selectedResource}
        handleResourceAccess={handleResourceAccess}
        closeDownloadModal={closeDownloadModal}
        handleCategoryChange={handleCategoryChange}
      />
    </>
  );
};

export default Services;
