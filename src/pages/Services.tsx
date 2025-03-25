
import React from 'react';
import { ServicePackages } from '@/components/ServicePackages';
import { NextStepsSection } from '@/components/recommendation/NextStepsSection';
import DownloadOptions from '@/components/DownloadOptions';
import { useServicesPage } from '@/hooks/services/useServicesPage';
import { useToast } from '@/hooks/use-toast';
import { getServicePageRecommendations } from '@/services/recommendation/recommendationService';

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
          onClose={closeDownloadModal}
        />
      )}
    </>
  );
};

export default Services;
