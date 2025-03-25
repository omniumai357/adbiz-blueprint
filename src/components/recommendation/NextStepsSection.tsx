
import React from "react";
import { NextStepCard, NextStepRecommendation } from "./NextStepCard";
import { TourButton } from "@/components/tour/TourButton";
import { 
  ArrowRight, 
  LightbulbIcon, 
  Star, 
  Package, 
  MessageSquare, 
  CheckCircle 
} from "lucide-react";

interface NextStepsSectionProps {
  recommendations: NextStepRecommendation[];
  className?: string;
  title?: string;
}

export const NextStepsSection: React.FC<NextStepsSectionProps> = ({
  recommendations,
  className,
  title = "Recommended Next Steps",
}) => {
  if (!recommendations.length) return null;
  
  // Sort recommendations by priority (lower number = higher priority)
  const sortedRecommendations = [...recommendations].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <TourButton className="h-8 w-8" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRecommendations.map((recommendation) => (
          <NextStepCard
            key={recommendation.id}
            recommendation={recommendation}
          />
        ))}
      </div>
    </section>
  );
};

// Helper function to generate recommendations based on context
export const getServicePageRecommendations = (
  viewedPackages: string[] = [], 
  completedTour: boolean = false,
  selectedCategory: string = "monthly"
): NextStepRecommendation[] => {
  const recommendations: NextStepRecommendation[] = [];

  // If user hasn't completed the tour, suggest it
  if (!completedTour) {
    recommendations.push({
      id: "tour",
      title: "Take a Guided Tour",
      description: "Explore our services with a step-by-step guide to find what's best for your business.",
      actionText: "Start Tour",
      actionLink: "#tour-button", // This will be handled by the TourButton
      icon: <Star className="h-5 w-5" />,
      priority: 1
    });
  }

  // If user has viewed packages but not chosen one
  if (viewedPackages.length > 0) {
    recommendations.push({
      id: "package-selection",
      title: "Choose a Package",
      description: `You've explored our ${selectedCategory} packages. Ready to select one that fits your needs?`,
      actionText: "View Packages",
      actionLink: "#packages-grid",
      icon: <Package className="h-5 w-5" />,
      priority: 2
    });
  } else {
    // If user hasn't viewed packages yet
    recommendations.push({
      id: "explore-packages",
      title: "Explore Our Packages",
      description: "Discover our range of advertising packages designed to boost your business visibility.",
      actionText: "See Options",
      actionLink: "#packages-grid",
      icon: <Package className="h-5 w-5" />,
      priority: 2
    });
  }

  // Always recommend contact for personalized assistance
  recommendations.push({
    id: "contact-support",
    title: "Need Personalized Assistance?",
    description: "Our team can help you choose the right package for your specific needs.",
    actionText: "Contact Us",
    actionLink: "/contact?source=services&topic=sales",
    icon: <MessageSquare className="h-5 w-5" />,
    priority: 3
  });

  // Add checkout recommendation if they've viewed packages
  if (viewedPackages.length > 0) {
    recommendations.push({
      id: "proceed-checkout",
      title: "Ready to Get Started?",
      description: "Proceed to checkout to complete your service package selection.",
      actionText: "Proceed to Checkout",
      actionLink: `/checkout?package=${viewedPackages[0]}`,
      icon: <CheckCircle className="h-5 w-5" />,
      priority: viewedPackages.length > 1 ? 4 : 3
    });
  }

  return recommendations;
};
