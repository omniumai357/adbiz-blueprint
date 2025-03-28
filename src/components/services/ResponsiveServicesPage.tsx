
import React from 'react';
import { useServicesPage } from '@/hooks/services/useServicesPage';
import { CategorySelection } from './CategorySelection';
import { ServicesGrid } from './ServicesGrid';
import { ContactCTA } from './ContactCTA';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { PackageCard } from '@/components/PackageCard';
import { useResponsive } from '@/hooks/useResponsive';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from '@/lib/data'; // Import the correct Package type

/**
 * ResponsiveServicesPage component
 * 
 * A fully responsive page layout for the services section.
 * Implements mobile-first design principles and adapts to all screen sizes.
 */
export const ResponsiveServicesPage: React.FC = () => {
  const { 
    packages, 
    isLoading, 
    error, 
    selectedCategory, 
    handleCategoryChange 
  } = useServicesPage();
  
  const { isMobile } = useResponsive();
  
  // Filter packages by selected category and convert to the correct Package type
  const filteredPackages = packages
    .filter(pkg => pkg.category === selectedCategory)
    .map(pkg => ({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      category: pkg.category as "monthly" | "custom" | "platinum",
      price: pkg.price,
      features: pkg.features,
      popular: pkg.popular || false
    }));
  
  return (
    <ResponsiveContainer className="py-6 md:py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
        Our Service Packages
      </h1>
      
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
        Choose from our range of advertising packages designed to boost your business growth.
        Each package is tailored to meet different business needs and budgets.
      </p>
      
      <CategorySelection 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      {isLoading ? (
        <ServicesGrid>
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </ServicesGrid>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <ServicesGrid minItemWidth={isMobile ? 280 : 320} gap={isMobile ? "sm" : "md"}>
            {filteredPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </ServicesGrid>
          
          {filteredPackages.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                No packages available for this category. Please try another category.
              </p>
            </div>
          )}
        </>
      )}
      
      <div className="mt-12">
        <ContactCTA />
      </div>
    </ResponsiveContainer>
  );
};
