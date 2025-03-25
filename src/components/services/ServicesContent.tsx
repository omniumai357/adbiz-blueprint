
import React from 'react';
import { ServicePackages } from '@/components/ServicePackages';
import { NextStepsSection } from '@/components/recommendation/NextStepsSection';
import DownloadOptions from '@/components/DownloadOptions';
import { getServicePageRecommendations } from '@/utils/recommendations';
import { CategorySelection } from '@/components/services/CategorySelection';
import { PackageFeatures } from '@/components/services/PackageFeatures';
import { ContactCTA } from '@/components/services/ContactCTA';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ServicesContentProps {
  viewedPackages: string[];
  selectedCategory: string;
  hasCompletedTour: boolean;
  hasPurchased: boolean;
  error: string | null;
  isLoading: boolean;
  showDownloadModal: boolean;
  selectedResource: any;
  handleResourceAccess: (resource: any) => void;
  closeDownloadModal: () => void;
  handleCategoryChange: (category: string) => void;
}

/**
 * ServicesContent Component
 * 
 * Contains the main content of the Services page.
 */
export const ServicesContent: React.FC<ServicesContentProps> = ({
  viewedPackages,
  selectedCategory,
  hasCompletedTour,
  hasPurchased,
  error,
  isLoading,
  showDownloadModal,
  selectedResource,
  handleResourceAccess,
  closeDownloadModal,
  handleCategoryChange,
}) => {
  return (
    <>
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

export default ServicesContent;
