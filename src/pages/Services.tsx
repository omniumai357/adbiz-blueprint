
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ServicePackages } from '@/components/ServicePackages';
import { NextStepsSection, getServicePageRecommendations } from '@/components/recommendation/NextStepsSection';
import { useTour } from '@/contexts/tour-context';
import { supabase } from '@/integrations/supabase/client';

const Services = () => {
  const [searchParams] = useSearchParams();
  const { isActive: isTourActive } = useTour();
  const [viewedPackages, setViewedPackages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("monthly");
  const [hasPurchased, setHasPurchased] = useState(false);
  
  // Track viewed packages
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam && !viewedPackages.includes(packageParam)) {
      setViewedPackages(prev => [...prev, packageParam]);
    }
  }, [searchParams]);
  
  // Check if user has purchased any package
  useEffect(() => {
    const checkPurchaseHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user has any completed orders
          const { data: orders } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .limit(1);
            
          setHasPurchased(orders && orders.length > 0);
        }
      } catch (error) {
        console.error("Error checking purchase history:", error);
      }
    };
    
    checkPurchaseHistory();
  }, []);

  // Update selectedCategory when ServicePackages component changes it
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

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
      
      {/* Add the personalized next steps recommendations section with e-books */}
      <NextStepsSection 
        recommendations={getServicePageRecommendations(
          viewedPackages,
          false, // Replace with actual tour completion status
          selectedCategory,
          hasPurchased
        )}
        className="mt-12 mb-8"
        title="Recommended Next Steps"
      />
    </>
  );
};

export default Services;
