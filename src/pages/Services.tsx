
import React from 'react';
import { ServicePackages } from '@/components/ServicePackages';
import { NextStepsSection } from '@/components/recommendation/NextStepsSection';
import DownloadOptions from '@/components/DownloadOptions';
import { useServicesPage } from '@/hooks/services/useServicesPage';
import { useToast } from '@/hooks/use-toast';
import { getServicePageRecommendations } from '@/utils/recommendations';
import { ServicesTitle } from '@/components/services/ServicesTitle';
import { CategorySelection } from '@/components/services/CategorySelection';
import { PackageFeatures } from '@/components/services/PackageFeatures';
import { ContactCTA } from '@/components/services/ContactCTA';

const Services = () => {
  const {
    viewedPackages,
    selectedCategory,
    hasCompletedTour,
    hasPurchased,
    showDownloadModal,
    downloadResource,
    handleCategoryChange,
    handleResourceAccess,
    closeDownloadModal
  } = useServicesPage();
  
  const { toast } = useToast();
  
  // Set up toast event listener
  React.useEffect(() => {
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
      <ServicesTitle />
      
      <CategorySelection />
      
      <div id="packages-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ServicePackages onCategoryChange={handleCategoryChange} />
      </div>
      
      <PackageFeatures />
      
      <ContactCTA />
      
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
          onClose={closeDownloadModal}
        />
      )}
    </>
  );
};

export default Services;
