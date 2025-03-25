
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PackageFeaturesProps {
  selectedCategory: string;
  error?: string | null;
}

export const PackageFeatures = ({ selectedCategory, error }: PackageFeaturesProps) => {
  const features = {
    monthly: [
      "Monthly performance reports",
      "Social media management",
      "Basic content creation"
    ],
    quarterly: [
      "Quarterly performance reports",
      "Enhanced social media strategy",
      "Content calendar planning",
      "Email marketing campaigns"
    ],
    annual: [
      "Comprehensive annual strategy",
      "Premium content creation",
      "Dedicated account manager",
      "Monthly strategy meetings",
      "SEO optimization"
    ]
  };
  
  const currentFeatures = features[selectedCategory as keyof typeof features] || features.monthly;
  
  return (
    <div id="package-features" className="mb-8">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Package Features</h2>
      <ul className="list-disc pl-5 space-y-2">
        {currentFeatures.map((feature, index) => (
          <li key={index} className="text-gray-700">{feature}</li>
        ))}
      </ul>
    </div>
  );
};
