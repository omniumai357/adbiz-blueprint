
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Props for the PackageFeatures component
 */
interface PackageFeaturesProps {
  selectedCategory: string;
  error?: string | null;
}

/**
 * PackageFeatures Component
 * 
 * Displays a list of features included in the selected service package category.
 * Features are dynamically shown based on the currently selected category.
 * 
 * @param {PackageFeaturesProps} props - Component props
 * @param {string} props.selectedCategory - The currently selected service category
 * @param {string|null} [props.error] - Optional error message to display
 */
export const PackageFeatures = ({ selectedCategory, error }: PackageFeaturesProps) => {
  // Features organized by category for easy lookup
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
  
  // Get features for the selected category or default to monthly
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
