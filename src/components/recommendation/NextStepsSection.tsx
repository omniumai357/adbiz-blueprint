
import React from "react";
import { NextStepCard, NextStepRecommendation } from "./NextStepCard";
import { useToast } from "@/hooks/ui/use-toast";
import { cn } from "@/lib/utils";

interface NextStepsSectionProps {
  recommendations: NextStepRecommendation[];
  className?: string;
  title?: string;
  onResourceDownload?: (resourceId: string, resourceType: string) => void;
}

export const NextStepsSection: React.FC<NextStepsSectionProps> = ({ 
  recommendations, 
  className,
  title = "Recommended Next Steps",
  onResourceDownload
}) => {
  const { toast } = useToast();
  
  // Handle resource downloads
  const handleResourceDownload = (recommendation: NextStepRecommendation) => {
    if (onResourceDownload && recommendation.resourceId && recommendation.type) {
      onResourceDownload(recommendation.resourceId, recommendation.type);
      return;
    }
    
    // Default handling if no custom handler provided
    toast({
      title: `${recommendation.type === 'ebook' ? 'E-book' : 'Tutorial'} access granted`,
      description: `You now have access to this resource.`
    });
  };
  
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations
          .sort((a, b) => a.priority - b.priority)
          .map((recommendation) => (
            <NextStepCard 
              key={recommendation.id} 
              recommendation={recommendation}
              onResourceDownload={() => handleResourceDownload(recommendation)}
            />
          ))}
      </div>
    </div>
  );
};

// Helper function to generate service page recommendations
export const getServicePageRecommendations = (
  viewedPackages: string[] = [],
  hasCompletedTour: boolean = false,
  selectedCategory: string = "monthly",
  hasPurchased: boolean = false
): NextStepRecommendation[] => {
  const recommendations: NextStepRecommendation[] = [];
  
  // Always recommend completing the tour if not completed
  if (!hasCompletedTour) {
    recommendations.push({
      id: "tour-recommendation",
      title: "Take a Guided Tour",
      description: "Discover all the features of our services page with a guided tour.",
      actionText: "Start Tour",
      actionLink: "#start-tour", // This will be handled by the component
      priority: 1,
      type: "navigation"
    });
  }
  
  // Recommend packages based on what the user has viewed
  if (viewedPackages.length > 0) {
    // If user has viewed packages but not purchased, suggest contacting for consultation
    if (!hasPurchased) {
      recommendations.push({
        id: "contact-consultation",
        title: "Get a Free Consultation",
        description: "Speak with our marketing experts to find the perfect package for your business.",
        actionText: "Book Consultation",
        actionLink: "/contact?topic=consultation",
        priority: 2,
        type: "contact"
      });
    }
  } else {
    // If user hasn't viewed any packages, suggest category exploration
    recommendations.push({
      id: "explore-packages",
      title: `Explore ${selectedCategory === 'monthly' ? 'Monthly Services' : 'Custom Ad Creation'}`,
      description: "Browse our selection of professional marketing packages designed for your needs.",
      actionText: "View Packages",
      actionLink: "#packages-grid",
      priority: 2,
      type: "navigation"
    });
  }
  
  // E-book recommendations based on user behavior
  if (viewedPackages.includes("premium") || selectedCategory === "premium") {
    recommendations.push({
      id: "premium-strategy-ebook",
      title: "Premium Marketing Strategy Guide",
      description: "Learn how to maximize your ROI with premium marketing strategies.",
      actionText: "Download E-book",
      actionLink: "#",
      priority: 3,
      type: "ebook",
      resourceId: "premium-strategy-guide"
    });
  } else if (viewedPackages.includes("standard") || selectedCategory === "standard") {
    recommendations.push({
      id: "standard-strategy-ebook",
      title: "Effective Marketing on a Budget",
      description: "Smart strategies for effective marketing without breaking the bank.",
      actionText: "Download E-book",
      actionLink: "#",
      priority: 3,
      type: "ebook",
      resourceId: "budget-marketing-guide"
    });
  }
  
  // Tutorial recommendations based on user behavior
  if (hasPurchased) {
    recommendations.push({
      id: "getting-started-tutorial",
      title: "Getting Started with Your Package",
      description: "A step-by-step video guide to make the most of your new marketing services.",
      actionText: "Watch Tutorial",
      actionLink: "#",
      priority: 2,
      type: "tutorial",
      resourceId: "getting-started-guide"
    });
  }
  
  // Partner discount recommendations
  // These are available regardless of user behavior but can be more targeted
  recommendations.push({
    id: "seo-tool-partner-discount",
    title: "Exclusive SEO Tool Discount",
    description: "Get 30% off SEMrush Pro, our recommended SEO platform for marketing analytics.",
    actionText: "Claim Discount",
    actionLink: "https://partner.semrush.com/adbiz-special",
    priority: 4,
    type: "partner-discount",
    partnerInfo: {
      name: "SEMrush",
      discountPercentage: 30,
      discountCode: "ADBIZ30",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    }
  });
  
  if (viewedPackages.includes("premium") || hasPurchased) {
    recommendations.push({
      id: "design-tool-partner-discount",
      title: "Professional Design Suite Offer",
      description: "Save 25% on Canva Pro annual subscription for creating professional marketing materials.",
      actionText: "Get Discount",
      actionLink: "https://partner.canva.com/adbiz-pro",
      priority: 4,
      type: "partner-discount",
      partnerInfo: {
        name: "Canva",
        discountPercentage: 25,
        discountCode: "ADBIZPRO25",
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      }
    });
  }
  
  return recommendations;
};
