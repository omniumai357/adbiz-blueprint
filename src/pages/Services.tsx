
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useResourceAccess } from '@/hooks/useResourceAccess';
import { createToastEvent } from '@/utils/toast-utils';

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
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <CategorySelection 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      {isLoading ? (
        <div className="space-y-4 mb-8">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
          </div>
        </div>
      ) : (
        <div id="packages-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ServicePackages onCategoryChange={handleCategoryChange} />
        </div>
      )}
      
      <PackageFeatures 
        selectedCategory={selectedCategory}
        error={error}
      />
      
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
