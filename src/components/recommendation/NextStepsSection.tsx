
import React from "react";
import { NextStepCard, NextStepRecommendation } from "./NextStepCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { showSuccessToast } from "@/utils/toast-utils";

interface NextStepsSectionProps {
  /**
   * Array of recommendations to display
   */
  recommendations: NextStepRecommendation[];
  
  /**
   * Optional CSS class names to apply to the container
   */
  className?: string;
  
  /**
   * Optional custom title for the section
   * @default "Recommended Next Steps"
   */
  title?: string;
  
  /**
   * Optional handler for resource downloads
   * If not provided, a default handler with toast notification is used
   */
  onResourceDownload?: (resourceId: string, resourceType: string) => void;
}

/**
 * Renders a section of recommended next steps
 * 
 * Features:
 * - Displays cards for each recommendation
 * - Sorts recommendations by priority
 * - Handles resource download actions
 * - Shows success toasts for downloads
 * 
 * @param recommendations - Array of recommendation objects to display
 * @param className - Optional CSS class names to apply
 * @param title - Custom section title
 * @param onResourceDownload - Custom handler for resource downloads
 */
export const NextStepsSection: React.FC<NextStepsSectionProps> = ({ 
  recommendations, 
  className,
  title = "Recommended Next Steps",
  onResourceDownload
}) => {
  const { toast } = useToast();
  
  /**
   * Handles resource download requests
   * 
   * Either uses the provided custom handler or shows a success toast
   * 
   * @param resourceId - ID of the resource being downloaded
   * @param resourceType - Type of resource (e.g., 'ebook', 'tutorial')
   */
  const handleResourceDownload = (resourceId: string, resourceType: string) => {
    if (onResourceDownload) {
      onResourceDownload(resourceId, resourceType);
      return;
    }
    
    // Default handling if no custom handler provided
    showSuccessToast(
      `${resourceType === 'ebook' ? 'E-book' : 'Tutorial'} access granted`,
      `You now have access to this resource.`
    );
  };
  
  // Don't render anything if there are no recommendations
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
              onResourceDownload={(resourceId, resourceType) => handleResourceDownload(resourceId, resourceType)}
            />
          ))}
      </div>
    </div>
  );
};
